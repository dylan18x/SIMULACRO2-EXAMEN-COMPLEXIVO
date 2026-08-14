from rest_framework import serializers
from .models import Gate, Flight

class GateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gate
        fields = "__all__"

class FlightSerializer(serializers.ModelSerializer):
    gate_code = serializers.CharField(source="gate.code", read_only=True)

    class Meta:
        model = Flight
        fields = "__all__"