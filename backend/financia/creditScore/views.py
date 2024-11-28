from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.core.cache import cache
from .models import CreditScore
from .serializers import CreditScoreSerializer
from .exceptions import CreditScoreError

class CreditScoreViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar las operaciones CRUD de CreditScore
    """
    serializer_class = CreditScoreSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retorna solo los credit scores del usuario actual"""
        if self.request.user.is_authenticated:
            return CreditScore.objects.filter(user=self.request.user)
        else:
            return CreditScore.objects.none() 

    def perform_create(self, serializer):
        """Asigna el usuario actual al crear un nuevo credit score"""
        serializer.save(user=self.request.user)

    @swagger_auto_schema(
        operation_description="Calcula el puntaje crediticio del usuario. El puntaje se calcula y se guarda en cache por 1 hora.",
        responses={
            200: CreditScoreSerializer,
            400: openapi.Response('Error en los datos del puntaje crediticio'),
            500: openapi.Response('Error interno del servidor'),
        },
        request_body=None,
        operation_summary="Calcular puntaje crediticio"
    )
    @action(detail=True, methods=['post'])
    def calculate(self, request, pk=None):
        """
        Endpoint para calcular el credit score
        Si el puntaje ya está en el cache, lo recupera de allí. Si no, lo calcula y guarda en cache.
        """
        try:
            credit_score = self.get_object()
            
            # Intentar obtener del cache
            cache_key = f"credit_score_{credit_score.id}"
            score = cache.get(cache_key)
            
            if not score:
                # Calcular si no está en cache
                score = credit_score.calculate_score()
                cache.set(cache_key, score, 3600)
                cache_message = "Puntaje calculado y almacenado en cache."
            else:
                cache_message = "Puntaje recuperado desde cache."

            serializer = self.get_serializer(credit_score)
            return Response({**serializer.data, "cache_message": cache_message})
            
        except CreditScoreError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'Error interno del servidor'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def calculate_score_view(request, credit_score_id):
    credit_score = CreditScore.objects.get(id=credit_score_id)
    credit_score.calculate_score()
    return HttpResponse(f"Puntaje calculado: {credit_score.score}")
