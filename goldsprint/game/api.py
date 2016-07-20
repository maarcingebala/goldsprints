from rest_framework import renderers
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.generics import get_object_or_404

from .models import Race


@api_view(['POST'])
@renderer_classes([renderers.JSONRenderer])
def store_race_results(request, pk):
    race = get_object_or_404(Race, pk=pk)
