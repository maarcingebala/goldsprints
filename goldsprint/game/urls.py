from django.conf.urls import url

from . import api
from . import views


urlpatterns = [
    url(r'^$', views.menu, name='menu'),
    url(r'^new-player/$', views.new_player, name='new-player'),
    url(r'^new-race/$', views.new_race, name='new-race'),
    url(r'^race-(?P<pk>[0-9]+)/$', views.start_race, name='start-race'),
    url(r'^free-ride/$', views.free_ride, name='free-ride'),
    url(r'^scores/$', views.scores, name='scores'),

    url(r'^api/race-(?P<pk>[0-9]+)/$', api.save_race_results, name='save-race-results')
]
