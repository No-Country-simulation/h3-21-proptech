from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.core.cache import cache
from .serializers import CreditSimulationSerializer
from .utils import calculate_credit_details
from .exceptions import CreditSimulationError
from typing import Dict, Any
from drf_yasg.utils import swagger_auto_schema


@swagger_auto_schema(
    method='post',
    operation_description="Este endpoint calcula una simulación de crédito en base a los datos proporcionados (monto del crédito, tasa de interés y plazo). El resultado se guarda en caché por 1 hora.",
    request_body=CreditSimulationSerializer,
    responses={
        200: 'Simulación de crédito exitosa. Devuelve los detalles de la simulación.',
        400: 'Error de validación en los datos de entrada.',
        500: 'Error interno del servidor.',
    },
)
@api_view(['POST'])
def credit_simulation_api_view(request) -> Response:
    """
    Endpoint para calcular simulaciones de crédito.
    
    Args:
        request: HTTP request con los datos del crédito
        
    Returns:
        Response con los resultados de la simulación o errores de validación
    """
    try:
        serializer = CreditSimulationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Intentar obtener resultado del cache
        cache_key = _get_cache_key(serializer.validated_data)
        result = cache.get(cache_key)
        
        if not result:
            # Calcular si no está en cache
            result = _calculate_simulation(serializer.validated_data)
            # Guardar en cache por 1 hora
            cache.set(cache_key, result, 3600)
        
        # Guardar la simulación si todo está bien
        #serializer.save()
        
        return Response(result, status=status.HTTP_200_OK)
        
    except CreditSimulationError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def _calculate_simulation(data: Dict[str, Any]) -> Dict:
    """Realiza los cálculos de la simulación"""
    return calculate_credit_details(
        requested_amount=data['loan_amount'],
        monthly_interest_rate=data['interest_rate'] / 12,  # Convertir a tasa mensual
        term_months=data['term_months']
    )

def _get_cache_key(data: Dict[str, Any]) -> str:
    """Genera una clave única para el cache"""
    return f"credit_sim_{data['loan_amount']}_{data['interest_rate']}_{data['term_months']}"
