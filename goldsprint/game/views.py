from django.shortcuts import redirect, get_object_or_404
from django.template.response import TemplateResponse

from .forms import PlayerForm, RaceForm
from .models import Race, Player


def menu(request):
    recent_races = Race.objects.all()
    return TemplateResponse(request, 'menu.html', {
        'recent_races': recent_races})


def new_player(request):
    player = Player()
    form = PlayerForm(request.POST or None, instance=player)
    if form.is_valid():
        form.save()
        next_url = request.GET.get('next')
        return redirect(next_url)
    return TemplateResponse(request, 'player_form.html', {'form': form})


def new_race(request):
    race = Race()
    form = RaceForm(request.POST or None, instance=race)
    if form.is_valid():
        race = form.save()
        return redirect('game:start-race', pk=race.pk)
    return TemplateResponse(request, 'race_form.html', {'form': form})


def start_race(request, pk):
    qs = Race.objects.prefetch_related('players')
    race = get_object_or_404(qs, pk=pk)
    players = race.players.all()
    ctx = {
        'race': race,
        'player_one': players[0],
        'player_two': players[1]
    }
    return TemplateResponse(request, 'start_race.html', ctx)
