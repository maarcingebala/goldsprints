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
    players = models.ManyToManyField(Player)
    results = ArrayField(models.IntegerField(), blank=True, null=True)

    def get_absolute_url(self):
        return reverse('game:start-race', kwargs={'pk': self.pk})

    def __str__(self):
        players = self.players.all()
        try:
            player_one = players[0]
        except IndexError:
            player_one = '?'
        try:
            player_two = players[1]
        except IndexError:
            player_two = '?'
        return '%s vs. %s' % (player_one, player_two)
