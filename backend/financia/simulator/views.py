from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CreditSimulationSerializer
from .utils import calculate_credit_simulation

class CreditSimulationView(APIView):
    def post(self, request):
        """
        Calcula la simulación de crédito usando datos validados.
        """
        serializer = CreditSimulationSerializer(data=request.data)
        if serializer.is_valid():
            # Realizar el cálculo con datos validados
            data = serializer.validated_data
            result = calculate_credit_simulation(
                loan_amount=data['loan_amount'],
                annual_interest_rate=data['interest_rate'],
                term_months=data['term_months']
            )
            
            # (Opcional) Guardar la simulación
            serializer.save()
            
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
