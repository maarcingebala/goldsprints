from django.shortcuts import redirect, get_object_or_404
from django.template.response import TemplateResponse

from .forms import PlayerForm, RaceForm
from .models import Race, Player


def menu(request):
    return TemplateResponse(request, 'menu.html')


def new_player(request):
    player = Player()
    form = PlayerForm(request.POST or None, instance=player)
    if form.is_valid():
        form.save()
        next_url = request.GET.get('next')
        return redirect(next_url)
    return TemplateResponse(request, 'new_player.html', {'form': form})


def new_race(request):
    race = Race()
    form = RaceForm(request.POST or None, instance=race)
    if form.is_valid():
        race = form.save()
        return redirect('game:start-race', pk=race.pk)
    return TemplateResponse(request, 'new_race.html', {'form': form})


def start_race(request, pk):
    race = get_object_or_404(Race, pk=pk)
    ctx = {
        'race': race,
        'player_a': race.player_a,
        'player_b': race.player_b
    }
    return TemplateResponse(request, 'race.html', ctx)


def scores(request):
    races = Race.objects.exclude(
        race_time_a__isnull=True).exclude(
            race_time_b__isnull=True)

    best_times = {}
    for race in races:
        if not race.player_a in best_times or best_times[race.player_a] < race.race_time_a:
            best_times[race.player_a] = race.race_time_a
        if not race.player_b in best_times or best_times[race.player_b] < race.race_time_b:
            best_times[race.player_b] = race.race_time_b

    scores = [(player, best_time) for player, best_time in best_times.items()]
    scores = sorted(scores, key=lambda score: score[1])
    ctx = {'scores': scores}
    return TemplateResponse(request, 'scores.html', ctx)
