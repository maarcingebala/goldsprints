from django.conf.urls import url, include
from django.contrib import admin

from .game.urls import urlpatterns as game_urls

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'', include(game_urls, namespace='game')),
]
