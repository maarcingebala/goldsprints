from django.template import Library


register = Library()


@register.simple_tag()
def is_winner(race, name):
    return race.get_winner() == name
