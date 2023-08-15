from django.shortcuts import render
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.template import loader
from .models import User, GameVariant

# Create your views here.

# Home page
def home(request):
    game_variants_list = GameVariant.objects.all()
    return TemplateResponse(request, 'website/index.html', { "game_variants_list" : game_variants_list})

def test(request):
    u = User(nickname="test123")
    u.save()
    return HttpResponse("Added")