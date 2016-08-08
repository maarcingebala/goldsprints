from django.conf import settings


def get_setting_as_dict(name, short_name=None):
    short_name = short_name or name
    try:
        return {short_name: getattr(settings, name)}
    except AttributeError:
        return {}


def template_context(request):
    data = get_setting_as_dict('DEFAULT_DISTANCE')
    data.update(get_setting_as_dict('MODE_RACE'))
    data.update(get_setting_as_dict('MODE_FREE_RIDE'))
    return data
