from django.shortcuts import render

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class CreateUserView(APIView):

    @swagger_auto_schema(
        operation_description="Endpoint para crear un nuevo usuario",
        request_body=UserSerializer,
        responses={
            201: openapi.Response("Usuario creado exitosamente", UserSerializer),
            400: "Errores de validación",
        },
    )
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        


