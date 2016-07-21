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
    player_a = models.ForeignKey(Player, related_name='+')
    player_b = models.ForeignKey(Player, related_name='+')
    race_time_a = models.FloatField(blank=True, null=True)
    race_time_b = models.FloatField(blank=True, null=True)

    def get_absolute_url(self):
        return reverse('game:start-race', kwargs={'pk': self.pk})

    def __str__(self):
        player_a = self.player_a or '?'
        player_b = self.player_b or '?'
        return '%s vs. %s' % (player_a, player_b)

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
