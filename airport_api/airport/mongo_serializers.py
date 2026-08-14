from rest_framework import serializers

class EventType:
        CREATED = "created"
        BOARDING_STARTED = "boarding_started"
        DEPARTED = "departed"
        DELAYED = "delayed"
        CANCELLED = "cancelled"

        CHOICES = [
            (CREATED, "Created"),
            (BOARDING_STARTED, "Boarding started"),
            (DEPARTED, "Departed"),
            (DELAYED, "Delayed"),
            (CANCELLED, "Cancelled"),
        ]

class Source:
        WEB = "web"
        MOBILE = "mobile"
        SYSTEM = "system"

        CHOICES = [
            (WEB, "Web"),
            (MOBILE, "Mobile"),
            (SYSTEM, "System"),
        ]


class AirlineSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    code = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100)
    is_active = serializers.BooleanField(default=True)
    created_at = serializers.DateField(required=False)

class FlightEventSerializer(serializers.Serializer):
    flight_id = serializers.IntegerField()
    airline_id = serializers.CharField()
    event_type = serializers.ChoiceField(
        choices=EventType.CHOICES,
        default=EventType.CREATED
    )

    source = serializers.ChoiceField(
        choices=Source.CHOICES,
        default=Source.SYSTEM
    )
    description = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateField(required=False)

