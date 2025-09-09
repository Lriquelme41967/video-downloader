from django.urls import path
from . import views

urlpatterns = [
    path('api/download/', views.download_video, name='download_video'),
    path('api/check-url/', views.check_url, name='check_url'),
    path('api/supported-sites/', views.supported_sites, name='supported_sites'),
]