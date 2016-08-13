from django import forms
from django.forms import inlineformset_factory
from django.forms.forms import NON_FIELD_ERRORS

from .models import Race, Event


class RaceForm(forms.ModelForm):
    
    def __init__(self, *args, **kwargs):
        super(RaceForm, self).__init__(*args, **kwargs)
        self.fields['player_a'].widget.attrs['placeholder'] = "First player"
        self.fields['player_a'].widget.attrs['autofocus'] = True
        self.fields['player_b'].widget.attrs['placeholder'] = "Second player"

    class Meta:
        model = Race
        fields = ['player_a', 'player_b']

    def clean(self):
        player_a = self.cleaned_data.get('player_a')
        player_b = self.cleaned_data.get('player_b')
        if not (player_a and player_b) or player_a == player_b:
            self.add_error(NON_FIELD_ERRORS, 'Invalid player choice')


class EventForm(forms.ModelForm):
    
    class Meta:
        model = Event
        exclude = []


FirstRoundFormset = inlineformset_factory(
    Event, Race, fk_name='first_round', fields=('player_a', 'player_b'),
    can_delete=True, extra=1)
