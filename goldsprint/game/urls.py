from django.conf.urls import url

from . import api
from . import views


urlpatterns = [
    url(r'^$', views.menu, name='menu'),
    url(r'^free-ride/$', views.free_ride, name='free-ride'),
    url(r'^race/new/$', views.new_race, name='new-race'),
    url(r'^race/(?P<pk>[0-9]+)/$', views.start_race, name='start-race'),

    url(r'^event/new/$', views.new_event, name='new-event'),
    url(r'^event/(?P<pk>[0-9]+)/add-first-round/$', views.add_first_round, name='add-first-round'),
    url(r'^event/(?P<pk>[0-9]+)/race/(?P<race_pk>[0-9]+)/$', views.event_race, name='event-race'),
    url(r'^event/(?P<pk>[0-9]+)/scores/$', views.round_scores, name='round-scores'),

    url(r'^api/race-(?P<pk>[0-9]+)/$', api.save_race_results, name='save-race-results')
]
