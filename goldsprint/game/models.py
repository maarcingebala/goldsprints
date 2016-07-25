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

    def get_absolute_url(self):
        return reverse('game:start-race', kwargs={'pk': self.pk})

    def __str__(self):
        return '%s vs. %s' % (self.player_a, self.player_b)

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
