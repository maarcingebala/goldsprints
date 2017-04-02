from django.contrib import admin
from django.utils.html import format_html

from .models import Event, Race


class RaceInline(admin.TabularInline):
    model = Race
    fk_name = 'first_round'
    can_delete = False
    exclude = ('distance', 'second_round', 'player_a', 'player_b', 'race_time_a', 'race_time_b')
    extra = 0
    readonly_fields = ('get_player_a', 'get_time_a', 'get_player_b', 'get_time_b', 'get_winner',)

    def has_add_permission(self, request):
        return False
    
    def _bold(self, text):
        return format_html('<strong>%s</strong>' % text)

    def get_player_a(self, obj):
        if obj.get_winner() == obj.player_a:
            return self._bold(obj.player_a)
        return obj.player_a

    def get_player_b(self, obj):
        if obj.get_winner() == obj.player_b:
            return self._bold(obj.player_b)
        return obj.player_b

    def get_time_a(self, obj):
        if obj.get_winner() == obj.player_a:
            return self._bold(obj.race_time_a)
        return obj.race_time_a
    
    def get_time_b(self, obj):
        if obj.get_winner() == obj.player_b:
            return self._bold(obj.race_time_b)
        return obj.race_time_b

    def get_winner(self, obj):
        return obj.get_winner()
    get_winner.short_description = 'Winner'


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    inlines = [RaceInline]
