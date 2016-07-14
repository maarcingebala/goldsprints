from django import forms
from django.forms.forms import NON_FIELD_ERRORS

from .models import Race, Player


class PlayerForm(forms.ModelForm):
    class Meta:
        model = Player
        exclude = []


class RaceForm(forms.ModelForm):
    player_one = forms.ModelChoiceField(
        queryset=Player.objects, empty_label='Select first player')
    player_two = forms.ModelChoiceField(
        queryset=Player.objects, empty_label='Select second player')

    class Meta:
        model = Race
        fields = []

    def clean(self):
        player_one = self.cleaned_data.get('player_one')
        player_two = self.cleaned_data.get('player_two')
        if not (player_one and player_two) or player_one == player_two:
            self.add_error(NON_FIELD_ERRORS, 'Invalid player choice')

    def save(self, commit=True):
        race = super(RaceForm, self).save(commit=commit)
        race.players.add(self.cleaned_data['player_one'])
        race.players.add(self.cleaned_data['player_two'])
        return race
