from django.conf.urls import url

from . import views


urlpatterns = [
    url(r'^$', views.menu, name='menu'),
    url(r'^new-player/$', views.new_player, name='new-player'),
    url(r'^new-race/$', views.new_race, name='new-race'),
    url(r'^race-(?P<pk>[0-9]+)/$', views.start_race, name='start-race'),
]
