from django.conf.urls import url, include

from .game.urls import urlpatterns as game_urls

urlpatterns = [
    url(r'', include(game_urls, namespace='game')),
]
