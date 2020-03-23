from rest_framework import serializers
from .models import (Machine , Owner , Vehicle , Recorder ,  Material , MachineParty,PurchaseParty,VehicleParty,
                    MachineWork,VehicleWork,MixDebit,Worker,Purchase,DailyWork,Part,Debit,MachineSupply)

class MachineSerializer(serializers.ModelSerializer):
    """
    Serializer for the Machine Model.
    """
    class Meta:
        model = Machine
        fields = ['owner','name']

class MachineSupplySerializer(serializers.ModelSerializer):
    """
    Serializer for the Machine Supply  Model.
    """
    party = serializers.CharField(source='party.name')
    material = serializers.CharField(source='Material.name')
    class Meta:
        model = MachineSupply
        fields = ['party','material','date','quantity','drilling_feet']

class VehicleSupplySerializer(serializers.ModelSerializer):
    """
    Serializer for the Vehicle Supply Model.
    """
    material = serializers.CharField(source='Material.name')
    class Meta:
        model = MachineSupply
        fields = ['material','date','quantity']

class VehicleSerializer(serializers.ModelSerializer):
    """
    Serializer for the Vehicle Model.
    """
    class Meta:
        model = Vehicle
        fields = ['owner','name']

class RecorderSerializer(serializers.ModelSerializer):
    """
    Serializer for the Recorder Model.
    """
    class Meta:
        model = Recorder
        fields = ['owner','username','password']

class MaterialSerializer(serializers.ModelSerializer):
    """
    Serializer for the Store Model.
    """
    class Meta:
        model = Material
        fields = ['owner','name','measurement','quantity']

class MaterialListSerializer(serializers.ModelSerializer):
    """
    Serializer for the Store Model.
    """
    class Meta:
        model = Material
        fields = ['name','measurement','quantity']

class WorkerSerializer(serializers.ModelSerializer):
    """
    Serializer for worker model
    """
    class Meta:
        model = Worker
        fields = ['name','contact','village','salary']

# class PartySerializer(serializers.ModelSerializer):
#     """
#     Serializer for the party Model.
#     """
#     class Meta:
#         model = Party
#         fields = ['contact','village']

class MachinePartySerializer(serializers.ModelSerializer):
    """
    Serializer for the Machine Party Model.
    """
    # contact = serializers.RelatedField(source='credit_id', read_only=True)
    class Meta:
        model = MachineParty
        fields = ['contact','name','village']


class VehiclePartySerializer(serializers.ModelSerializer):
    """
    Serializer for the Vehicle Party Model.
    """
    class Meta:
        model = VehicleParty
        fields = ['name','contact','village']

class PurchasePartySerializer(serializers.ModelSerializer):
    """
    Serializer for the Vehicle Party Model.
    """
    class Meta:
        model = PurchaseParty
        fields = ['name','contact','village']

class MachineWorkSerializer(serializers.ModelSerializer):
    """
    Serializer for the MachineWork Model.
    """
    class Meta:
        model = MachineWork
        fields = ['party','machine','drilling_feet','diesel_amount','remark']

class VehicleWorkSerializer(serializers.ModelSerializer):
    """
    Serializer for the Vehice Work Model.
    """
    class Meta:
        model = VehicleWork
        fields = ['party','date','feet','five_feet','two_half_feet','remark']

class MixDebitSerializer(serializers.ModelSerializer):
    """
    Serializer for the Mix Debit Model.
    """
    class Meta:
        model = MixDebit
        fields = ['owner','date','spend_amount']

class PurchaseSerializer(serializers.ModelSerializer):
    """
    Serializer for the Purchase Model.
    """
    party_name = serializers.CharField(source='party.name')
    material_name = serializers.CharField(source='material.name')
    class Meta:
        model = Purchase
        fields = ['party_name','material_name','rate','net_amount','paid','remark','payment']

"""
class DailyExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyExpense
        fields = ['owner','debit_id','expense','remark']

"""
class DailyWorkSerializer(serializers.ModelSerializer):
    """
    Serializer for the Daily Work Model.
    """
    class Meta:
        model = Purchase
        fields = ['party','five_feet','five_feet_rate','two_half_feet','two_half_feet_rate','diesel_amount','net_amount']

class DebitSerializer(serializers.ModelSerializer):
    """
    Serializer for the Part Model.
    """
    class Meta:
        model = Debit
        fields = ['debit_amount','date']

class PartSerializer(serializers.ModelSerializer):
    """
    Serializer for the Part Model.
    """
    date = serializers.CharField(source='debit_id.date')
    class Meta:
        model = Part
        fields = ['name','date']

