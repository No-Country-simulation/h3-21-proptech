from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CreditScoreViewSet
from .views import calculate_score_view

# Crear el router para la API
router = DefaultRouter()
router.register(r'credit-scores', CreditScoreViewSet, basename='credit-score')

app_name = 'credit'  # Namespace de la aplicación

# URLs regulares
urlpatterns = [
    # Incluir las URLs del router de la API
    path('api/v1/', include((router.urls, 'credit-api'), namespace='v1')),
    #path('calculate-score/<int:credit_score_id>/', calculate_score_view, name='calculate_score'),
]

# Las URLs que genera el router serán:
# api/v1/credit-scores/ - GET (lista) y POST (crear)
# api/v1/credit-scores/{id}/ - GET (detalle), PUT/PATCH (actualizar), DELETE (eliminar)
# api/v1/credit-scores/{id}/calculate/ - POST (calcular score)