from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='Home Page'),
    path('test', views.test, name="Test"),
]