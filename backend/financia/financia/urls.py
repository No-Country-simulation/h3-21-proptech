"""
URL configuration for financia project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions



# Configuración de Swagger/OpenAPI
schema_view = get_schema_view(
    openapi.Info(
        title="Plataforma Financiera API",
        default_version='v1',
        description="API para la gestión financiera y cálculo de puntajes crediticios",
        terms_of_service="https://www.plataformafinanciera.com/terms/",
        contact=openapi.Contact(email="soporte@plataformafinanciera.com"),
        license=openapi.License(name="Licencia BSD"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),  # Acceso público a la documentación
)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('simulator/', include('simulator.urls')),
    path('', include('creditScore.urls')),
    path('', include('financing.urls')),

     # Documentación API
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]


# Servir archivos estáticos y media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)