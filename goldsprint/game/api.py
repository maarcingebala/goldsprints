from rest_framework import renderers, serializers, status
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from .models import Race


class RaceResultsSerializer(serializers.Serializer):
    player_a = serializers.FloatField()
    player_b = serializers.FloatField()


@api_view(['POST'])
@renderer_classes([renderers.JSONRenderer])
def save_race_results(request, pk):
    race = get_object_or_404(Race, pk=pk)
    serializer = RaceResultsSerializer(data=request.data)
    if serializer.is_valid():
        race.race_time_a = serializer.data['player_a']
        race.race_time_b = serializer.data['player_b']
        race.save()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
