from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.core.urlresolvers import reverse
from django.db import models


class Player(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Race(models.Model):
    distance = models.IntegerField(default=settings.DEFAULT_DISTANCE)
    player_a = models.CharField(max_length=255, default="")
    player_b = models.CharField(max_length=255, default="")
    race_time_a = models.FloatField(blank=True, null=True)
    race_time_b = models.FloatField(blank=True, null=True)
    first_round = models.ForeignKey(
        'Event', related_name='first_round', null=True, blank=True)
    second_round = models.ForeignKey(
        'Event', related_name='second_round', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def get_absolute_url(self):
        return reverse('game:start-race', kwargs={'pk': self.pk})

    def __str__(self):
        return '%s vs. %s' % (self.player_a, self.player_b)

    def is_finished(self):
        return self.race_time_a and self.race_time_b

    def get_winner(self):
        if self.race_time_a > self.race_time_b:
            return self.player_a
        elif self.race_time_b > self.race_time_a:
            return self.player_b
        else:
            return None

    def get_best_time(self):
        if self.race_time_a > self.race_time_b:
            return self.race_time_a
        else:
            return self.race_time_b


class Event(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    def get_race_url(self, race):
        return reverse('game:event-race', kwargs={'pk': self.pk, 'race_pk': race.pk})
