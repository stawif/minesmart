from django.shortcuts import render
from .serializers import (MachineSerializer , VehicleSerializer , RecorderSerializer , MaterialSerializer,
                            PurchasePartySerializer,VehiclePartySerializer,MachinePartySerializer,VehicleSupplySerializer,
                            MachineWorkSerializer , VehicleWorkSerializer,WorkerSerializer,MachineSupplySerializer,
                            DailyWorkSerializer,MaterialListSerializer,PartSerializer,PurchaseSerializer)
from rest_framework.views import APIView
from .models import  (Machine , Owner , Vehicle , Recorder , Material , Credit, WorkerDate,
                        MachineParty,PurchaseParty,VehicleParty,MachineWork,VehicleWork,Part,DailyExpense,
                        MixDebit,Worker,Purchase,DailyWork,MachineSupply,VehicleSupply,MixCredit,Debit)
from rest_framework.response import Response
from django.http import Http404 ,JsonResponse,HttpResponse
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import date
# Create your views here.

"""
api_ : represents that this data is comes from API
_i : represents that this is a instance of model
"""

def PartyContact(request):
    """
    Return json packet with all parties contacts
    """
    contacts= []
    party_i = Party.objects.all()
    for party in party_i:
        contacts.append(party.contact)
    jsonPacket = json.dumps(contacts)
    return JsonResponse(jsonPacket, safe=False)   

class PartyThroughContact(APIView):
    """
    Return name and village through contact
    """
    def post(self, request):
        api_contact = request.data['contact']
        party_i = Party.objects.get(contact=api_contact)
        derived_party_i= None 
        try:
            derived_party_i = MachineParty.objects.get(credit_id= party_i)
            print("In machine")
        except Exception:
            try:
                derived_party_i = VehicleParty.objects.get(credit_id= party_i)
                print("In vehicle")
            except Exception:
                try:
                    derived_party_i = DailyParty.objects.get(credit_id= party_i)        
                    print("In daily")
                except Exception as e:
                    print(e)
                    return HttpResponse("Can't find any party related to this contact") 
        packet = {
            "name": derived_party_i.name,
            "village": party_i.village
        }
        jsonPacket = json.dumps(packet)
        return JsonResponse(jsonPacket, safe= False)

# """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# APIView for List (get request)
# """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

class MachineList(APIView):
    """
    View to return List of Vehicles.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def get(self,request):
        queryset = Machine.objects.all()
        serializer = MachineSerializer(queryset,many=True)
        return Response(serializer.data)

class VehicleList(APIView):
    """
    View to return List of Vehicles.
    """
    def get(self,request):
        queryset = Vehicle.objects.all()
        serializer = VehicleSerializer(queryset,many=True)
        return Response(serializer.data)

class MaterialList(APIView):
    """
    View to return List of Party.
    """
    def get(self,request):
        queryset = Material.objects.all()
        serializer = MaterialListSerializer(queryset,many=True)
        return Response(serializer.data)

class WorkerList(APIView):
    """
    View to return List of party
    """
    def get(self,request):
        queryset = Worker.objects.all()
        serializer = WorkerSerializer(queryset,many=True)
        return Response(serializer.data)

class MachinePartyList(APIView):
    """
    View to return List of Machine Party.
    """
    def get(self,request):
        queryset = MachineParty.objects.all()
        serializer = MachinePartySerializer(queryset,many=True)
        return Response(serializer.data)

class VehiclePartyList(APIView):
    """
    View to return List of Vehicle Party.
    """
    def get(self,request):
        queryset = VehicleParty.objects.all()
        serializer = VehiclePartySerializer(queryset,many=True)
        return Response(serializer.data)   

class PurchasePartyList(APIView):
    """
    View to return List of Purchase Party.
    """
    def get(self,request):
        queryset = PurchaseParty.objects.all()
        serializer = PurchasePartySerializer(queryset,many=True)
        return Response(serializer.data)

class PurchaseList(APIView):
    """
    View to return List of Purchase.
    """
    def get(self,request):
        queryset = Purchase.objects.all().order_by('date')
        serializer = PurchaseSerializer(queryset,many=True)
        return Response(serializer.data)

class PartList(APIView):
    """
    View to return List of Parts.
    """
    def get(self,request):
        part_name_i = Part.objects.all()
        part_list = []
        for i in part_name_i:
            debit_i = Debit.objects.get(debit_id=i.debit_id)
            part_dict = {"name":i.name,"date":debit_i.date,"debit_amount":debit_i.debit_amount,"remark":debit_i.remark}
            part_list.append(part_dict)
        return Response(sorted(part_list,key=lambda i:i['date']),status=status.HTTP_200_OK)

class OwnerDebitList(APIView):
    """
    View to return List of Owner Debit.
    """
    def get(self,request):
        debit_i = Debit.objects.filter(debit_id=2).values('debit_amount','remark','date').order_by('date')
        return Response(debit_i,status=status.HTTP_200_OK)

class DailyExpenseList(APIView):
    """
    View to return List of Daily Expense.
    """
    def get(self,request):
        daily_expense_i = DailyExpense.objects.all()
        daily_expense_list = []
        for i in daily_expense_i:
            debit_i = Debit.objects.get(debit_id=i.debit_id)
            daily_expense_dict = {"category":i.category,"date":debit_i.date,"debit_amount":debit_i.debit_amount,"remark":debit_i.remark}
            daily_expense_list.append(daily_expense_dict)
        return Response(sorted(daily_expense_list,key=lambda i:i['date']),status=status.HTTP_200_OK)

class DailyWorkCredit(APIView):
    """
    View to Get Daily Work Credit Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def get(self,request):
        try:
            daily_work_i = DailyWork.objects.all().order_by('date')
            daily_work_json = []
            for i in daily_work_i:
                credit_i = Credit.objects.get(work=i.credit_id)
                daily_work_detail = {"party":i.name,"village":i.village,"credit":credit_i.credit_amount,"date":credit_i.date,"remark":credit_i.remark}
                daily_work_json.append(daily_work_detail)
            return Response(sorted(daily_work_json,key=lambda i:i['date']),status=status.HTTP_200_OK)
        except Exception as e:
            return Response('network error',status=status.HTTP_400_BAD_REQUEST)

class DailyExpenseDedit(APIView):
    """
    View to Get Daily Expense Debit Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def get(self,request):
        try:
            daily_expense_i = DailyExpense.objects.all()
            daily_expense_detail = []
            for i in daily_expense_i:
                debit_i = Debit.objects.get(debit_id=i.debit_id)
                daily_expense = {'category':i.category,"date":debit_i.date,"expense":debit_i.debit_amount,"remark":debit_i.remark}
                daily_expense_detail.append(daily_expense)
            return Response(sorted(daily_expense_detail,key=lambda i:i['date']),status=status.HTTP_200_OK)
        except Exception as e:
            return Response('network error',status=status.HTTP_400_BAD_REQUEST)

class PartDedit(APIView):
    """
    View to Get Part Debit Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def get(self,request):
        try:
            part_i = Part.objects.all()
            part_debit_detail = []
            for i in part_i:
                part_debit_i = Debit.objects.get(debit_id=i.debit_id)
                part_debit = {'name':i.name,"date":part_debit_i.date,"amount":part_debit_i.debit_amount,"remark":part_debit_i.remark}
                part_debit_detail.append(part_debit)
            return Response(sorted(part_debit_detail,key=lambda i:i['date']),status=status.HTTP_200_OK)
        except Exception as e:
            return Response('network error',status=status.HTTP_400_BAD_REQUEST)

class DailyWorkList(APIView):
    """
    View to Get Daily Work Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def get(self,request):
        try:
            daily_work_i = DailyWork.objects.all().order_by('date')
            daily_work_list = []
            for i in daily_work_i:
                credit_i = Credit.objects.get(work=i.credit_id)
                vehicle_i = Vehicle.objects.get(name=i.vehicle)
                daily_work_data = {"name":i.name,"village":i.village,"date":i.date,"vehicle":vehicle_i.name,
                                    "five_feet":i.five_feet,"five_feet_rate":i.five_feet_rate,"two_half_feet":i.two_half_feet,
                                    "two_half_feet_rate":i.two_half_feet_rate,"diesel_spend":i.diesel_spend,
                                    "net_amount":i.net_amount,"received_amount":credit_i.credit_amount,'remark':credit_i.remark}
                daily_work_list.append(daily_work_data)
            return Response(daily_work_list,status=status.HTTP_200_OK)
        except Exception as e:
            return Response('network error',status=status.HTTP_400_BAD_REQUEST)

class CreditList(APIView):
    """
    View to Credit Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def get(self,request):
        try:
            credit_i = Credit.objects.all().order_by('date').values('date','remark','credit_amount','work')
            for i in credit_i:
                mixcredit_i = MixCredit.objects.get(id=i['work'])
                i['category']=mixcredit_i.category
                del i['work']
            return Response(credit_i,status=status.HTTP_200_OK)
        except Exception as e:
            return Response('network errror',status=status.HTTP_404_NOT_FOUND)

class DebitList(APIView):
    """
    View to Debit Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def get(self,request):
        try:
            debit_i = Debit.objects.all().order_by('date').values('date','remark','debit_amount','debit_id')
            for i in debit_i:
                mixdebit_i = MixDebit.objects.get(id=i['debit_id'])
                i['category']=mixdebit_i.category
                del i['debit_id']
            return Response(debit_i,status=status.HTTP_200_OK)
        except Exception as e:
            return Response("network error",status=status.HTTP_404_NOT_FOUND)

class AccountDetail(APIView):
    """
    View to Account Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def get(self,request):
        try:
            debit_i = Debit.objects.all().order_by('date').values('date','remark','debit_amount','debit_id')
            for i in debit_i:
                mixdebit_i = MixDebit.objects.get(id=i['debit_id'])
                i['category']=mixdebit_i.category
                del i['debit_id']
            credit_i = Credit.objects.all().order_by('date').values('date','remark','credit_amount','work')
            for i in credit_i:
                mixcredit_i = MixCredit.objects.get(id=i['work'])
                i['category']=mixcredit_i.category
                del i['work']
            account_info = list(debit_i)
            for i in credit_i:
                account_info.append(i)
            return Response(sorted(account_info,key=lambda i:i['date']),status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response('network error,please try again later',status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OwnerAccountDetail(APIView):
    """
    View to Account Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def get(self,request):
        try:
            owner_i = Owner.objects.get(id=1)
            debit_i = Debit.objects.all().values('debit_amount')
            credit_i = Credit.objects.all().values('credit_amount')
            total_debit = 0
            total_credit = 0
            for i in debit_i:
                total_debit += int(i['debit_amount'])
            for i in credit_i:
                total_credit += int(i['credit_amount'])
            owner_account_detail = {"name":owner_i.name,"contact":owner_i.contact,
                                    "Total Credit":total_credit,"Total Debit":total_debit}
            return Response(owner_account_detail,status=status.HTTP_200_OK)
        except Exception as e:
            return Response('network error',status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MachineSupplyList(APIView):
    """
    View to Machine Supply Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def get(self,request):
        try:
            queryset = MachineSupply.objects.all().order_by('date')
            serializer = MachineSupplySerializer(queryset,many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response("network error",status=status.HTTP_400_BAD_REQUEST)

class VehicleSupplyList(APIView):
    """
    View to vehicle Supply Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def get(self,request):
        try:
            queryset = VehicleSupply.objects.all().order_by('date')
            serializer = VehicleSupplySerializer(queryset,many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response("network error",status=status.HTTP_400_BAD_REQUEST)

# """""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# APIView for Registration (post request)
# """""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

class AddMachine(APIView):
    """
    View to Add New Machine in Database
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        machine_name_list = Machine.objects.all().values('name')
        owner = Owner.objects.get(id=1)
        try:
            api_name = request.data['name']
        except Exception as e:
            return Response('please provide all information correctly',status=status.HTTP_204_NO_CONTENT)
        """
        Condition to check Whether a machine is already exists or not.
        """
        if request.data in machine_name_list:
            return Response("machine already exists")
        else:
            request.data["owner"]=owner.id                                      #Owner Id for Owner field in 
            serializer = MachineSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response("{} Machine Added".format(api_name), status=status.HTTP_201_CREATED)
            return Response(serializer.data,status=status.HTTP_400_BAD_REQUEST)

class AddVehicle(APIView):
    """
    View to Add New Vehicle in Database.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        vehicle_name_list = Vehicle.objects.all().values('name')
        owner = Owner.objects.get(id=1)
        try:
            api_name = request.data['name']
        except Exception as e:
             return Response('please provide all information correctly',status=status.HTTP_204_NO_CONTENT)
        """
        Condition to check Whether a Vehicle is already exists or not.
        """
        if request.data in vehicle_name_list:
            return Response("{}  already exists".format(api_name))
        else:
            request.data["owner"]=owner.id                                      #Owner Id for Owner field in 
            serializer = VehicleSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response("{} Vehicle added".format(request.data['name']), status=status.HTTP_201_CREATED)
            return Response(serializer.data,status=status.HTTP_400_BAD_REQUEST)

class AddRecorder(APIView):
    """
    View to Add New Recorder in Database
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        recorder_name_list = Recorder.objects.all().values('username')
        owner = Owner.objects.get(id=1)
        try:
            api_username = request.data['username']
            api_password = request.data['password']
        except Exception as e:
            return Response('please provide all information correctly',status=status.HTTP_204_NO_CONTENT) 
        """
        Condition to check Whether a Recorder is already exists or not.
        """
        if request.data['username'] in recorder_name_list:
            return Response("username already exists")
        else:
            request.data["owner"]=owner.id                                      #Owner Id for Owner field in 
            serializer = RecorderSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response("{} Recorder created".format(api_username), status=status.HTTP_201_CREATED)
            return Response("Either recorder exists or details are incorrect",status=status.HTTP_400_BAD_REQUEST)

class AddMaterial(APIView):
    """
    View to Add New Material in Store in Database.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        Material_list = Material.objects.all().values('owner','name')
        owner = Owner.objects.get(id=1)
        
        Material_dict = {'owner':owner.id,'name':request.data['name']}
        try:
            api_name = request.data['name']
            api_measurement = request.data['measurement']
            api_quantity = request.data['quantity']
        except Exception as e:
            return Response('please provide all information correctly',status=status.HTTP_204_NO_CONTENT) 
        """
        Condition to check Whether a Material is already exists or not.
        """
        if Material_dict in Material_list:
            return Response("Material already exists")
        else:
            request.data["owner"]=owner.id                                      #Owner Id for Owner field in 
            serializer = MaterialSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response("{} Store Material added".format(api_name), status=status.HTTP_201_CREATED)
            return Response("Either exists or incorrect details",status=status.HTTP_400_BAD_REQUEST)

class AddMachineParty(APIView):
    """
    View to Add New Machine party in Database.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        machine_party_list = MachineParty.objects.all().values('name')  #Return Dictionary with name of machines
        owner = Owner.objects.get(id=1)
        try:
            api_name = request.data['name']
            api_contact = request.data['contact']
            api_village = request.data['village']
            api_crasher = request.data['crasher']
        except Exception as e:
            return Response('please provide all information correctly',status=status.HTTP_204_NO_CONTENT)
        machine_name = {"name":api_name}
        if machine_name in machine_party_list:
            return Response('Party Already Exists in Machine Work ')
        else:
                try:
                    credit_id_i = MixCredit.objects.create(owner=owner,category="machine_party")
                except Exception:
                    return Response("Data is not sufficient",status=status.HTTP_404_NOT_FOUND)
                try:
                    machine_party_i = MachineParty.objects.create(credit_id=credit_id_i,name=api_name,contact=api_contact,village=api_village,crasher=api_crasher)
                    return Response("{} party added".format(api_name),status=status.HTTP_201_CREATED)
                except Exception:
                    credit_id_i.delete()
                    return Response("Party not Created , Network problem ",status=status.HTTP_408_REQUEST_TIMEOUT)

        return Response("please provide correct details",status=status.HTTP_400_BAD_REQUEST)

class AddVehicleParty(APIView):
    """
    View to Add New Vehicle Party in Database.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        vehicle_party_list = VehicleParty.objects.all().values('name')
        owner = Owner.objects.get(id=1)
        try:
            api_name = request.data['name']
            api_contact = request.data['contact']
            api_village = request.data['village']
        except Exception as e:
            return Response('please provide all information correctly',status=status.HTTP_204_NO_CONTENT)
        vehicle_party = {"name":api_name}
        if vehicle_party in vehicle_party_list:
            return Response('Party Already Exists in Vehicle Work')
        else:
                try:
                    credit_id_i = MixCredit.objects.create(owner=owner,category="vehicle_party")
                except Exception:
                    return Response("Data is not correct",status=status.HTTP_400_BAD_REQUEST)
                try:
                    vehicle_party_i = VehicleParty.objects.create(credit_id=credit_id_i,name=api_name,contact=api_contact,village=api_village)
                    return Response("{} party added".format(api_name,status=status.HTTP_201_CREATED))
                except Exception:
                    credit_id_i.delete()
                    return Response("Party not Created, Network problem")

        return Response("please provide correct data",status=status.HTTP_400_BAD_REQUEST)

class AddPurchaseParty(APIView):
    """
    View to Add New Purchase Party in Database.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        purchase_party_list = PurchaseParty.objects.all().values('name')
        owner = Owner.objects.get(id=1)
        try:
            api_name = request.data['name']
            api_contact = request.data['contact']
            api_village = request.data['village']
        except Exception as e:
            return Response('please provide all information correctly',status=status.HTTP_204_NO_CONTENT)
        try:
            mix_debit_create = MixDebit.objects.create(owner=owner,category="purchase_debit")
        except Exception:
            return Response("Error due to mix_debit_creation")
        try:
            purchase_party_instance = PurchaseParty.objects.create(owner=owner,debit_id=mix_debit_create,name=api_name,contact=api_contact,village=api_village)
            return Response("{} party added".format(api_name),status=status.HTTP_201_CREATED)
        except Exception as e:
            mix_debit_create.delete()
            return Response("Party not Created due to Network problem.")
        return Response("Please Provide Correct data.",status=status.HTTP_400_BAD_REQUEST)

class AddWorker(APIView):
    """
    View to Add New Worker in Database.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        owner = Owner.objects.get(id=1)
        try:
            api_name = request.data['name']
            api_contact = request.data['contact']
            api_village = request.data['village']
            api_salary = request.data['salary']
        except Exception as e:
            return Response('please provide all information correctly',status=status.HTTP_204_NO_CONTENT)
        if request.data:
            try:
                mix_debit_create_i = MixDebit.objects.create(owner=owner,category="worker_debit")
            except Exception:
                return Response("please provide correct data",status=status.HTTP_400_BAD_REQUEST)
            try:
                worker_create_i = Worker.objects.create(owner=owner,debit_id=mix_debit_create_i,name=api_name,contact=int(api_contact),
                village=api_village,salary=float(api_salary))
                return Response("{} Worker Added".format(api_name),status=status.HTTP_201_CREATED)
            except Exception as e:
                mix_debit_create_i.delete()
                return Response('please provide all required datad',status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

# """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# APIView for Entry (post request)
# """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

class AddMachineWork(APIView):
    """
    View to Add New MAchine Work in Database.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_party_name = request.data['party']
            api_machine_name = request.data['machine']
            api_date = request.data['date']
            api_drilling_feet = request.data['drilling_feet']
            api_diesel_amount = request.data['diesel_amount']
            api_remark = request.data['remark']
            api_holes = request.data['holes']
            api_payment = request.data['payment']
        except Exception as e:
            return Response('please provide all information correctly',status=status.HTTP_204_NO_CONTENT)
        try:
            party_id = MachineParty.objects.get(name=request.data['party'])
            machine_id = Machine.objects.get(name=request.data['machine'])
        except Exception as e:
            return Response("Party or MAchine does not Exists in Machine or Machine Party List.")
        if request.data:
            try:
                machine_work = MachineWork.objects.create(party=party_id,machine=machine_id,date=api_date,
                drilling_feet=float(api_drilling_feet),diesel_amount=float(api_diesel_amount),remark=api_remark,holes=api_holes,
                payment=api_payment)
                return Response("{} Machine work added".format(machine_id.name),status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response("{} for date {} is already exists".format(api_party_name,api_date))
        return Response(status=status.HTTP_400_BAD_REQUEST)

class AddVehicleWork(APIView):
    """
    View to Add New Vehicle Work in Database.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        vehicle_party_list = VehicleParty.objects.all().values('name')
        vehicle_list = Vehicle.objects.all().values('name')
        try:
            api_party_name = request.data['party']
            api_date = request.data['date']
            api_feet = round(request.data['feet'],2)
            api_five_feet = request.data['five_feet']
            api_two_half_feet = request.data['two_half_feet']
            api_remark = request.data['remark']
            api_payment = request.data['payment']
        except Exception as e:
            return Response('please provide all information correctly',status=status.HTTP_204_NO_CONTENT)
        party_name = {'name':api_party_name}
        if party_name not in vehicle_party_list:
            return Response('Vehicle Party Does not exists.')
        else:
            party_id_i = VehicleParty.objects.get(name=api_party_name)
            try:
                 vehicle_work_i = VehicleWork.objects.create(party=party_id_i,date=api_date,
                 feet=float(api_feet),five_feet=float(api_five_feet),two_half_feet=float(api_two_half_feet),remark=api_remark,payment=api_payment)
                 return Response("{} Vehicle work added".format(api_party_name),status = status.HTTP_201_CREATED)
            except Exception as e:
                return Response("{} for date {} is already exists".format(api_party_name,api_date),status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_400_BAD_REQUEST)

class AddPurchase(APIView):
    """
    View to Add Purchase in Database.
    """
    def post(self,request):
        owner = Owner.objects.get(id=1)
        try:
            purchase_party = PurchaseParty.objects.get(name=request.data['party'])
        except Exception:
            return Response("Purchase Party Does not Exists.")
        try:
            Material_instance = Material.objects.get(name=request.data['material'])
        except Exception:
            return Response("Material Does not Exists.Please Add Material.")
        try:
            api_quantity = float(request.data['quantity'])
            api_rate = float(request.data['rate'])
            net_amount = api_quantity*api_rate
            api_remark = request.data['remark']
            api_date = request.data['date']
            api_payment = request.data['payment']
            
            purchase_create = Purchase.objects.create(party=purchase_party,material=Material_instance,rate=api_rate,
            date =api_date,quantity=api_quantity,net_amount=net_amount,remark=api_remark,payment=api_payment)
            
            new_quantity = Material_instance.quantity+api_quantity
            Material.objects.filter(name=request.data['material']).update(quantity=new_quantity)          
            
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response('Please Provide All Required Data.',status=status.HTTP_204_NO_CONTENT)
        #return Response(status=status.HTTP_400_BAD_REQUEST)

class AddDailyWork(APIView):
    """
    View to Add New Worker in Database.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        owner_i = Owner.objects.get(id=1)
        try:
            api_name = request.data['name']
            api_vehicle = request.data['vehicle']
            api_date = request.data['date']
            api_village = request.data['village']
            api_five_feet = request.data['five_feet']
            api_five_feet_rate = request.data['five_feet_rate']
            api_two_half_feet = request.data['two_half_feet']
            api_two_half_feet_rate = request.data['two_half_feet_rate']
            api_diesel_spend = request.data['diesel_spend']
            api_remark = request.data['remark']
            api_received_amount = request.data['received_amount']
        except Exception as e:
            print(e)
            return Response('please provide all information correctly',status=status.HTTP_204_NO_CONTENT)
        try:
            vehicle_i = Vehicle.objects.get(name=api_vehicle)
        except Exception as e:
            return Response("Vehicle does not exists")
        net_amount = float(api_five_feet)*float(api_five_feet_rate)+float(api_two_half_feet)*float(api_two_half_feet_rate)
        try:
            #Enter daily Expense,MixDebit,Debit for diesel spend amount
            try:       
                try:
                    debit_id = MixDebit.objects.create(owner=owner_i,date=api_date,category="daily_expense_debit")
                except Exception as e:
                    return Response('mix debit not created,please try again')
                try:
                    daily_expense_i = DailyExpense.objects.create(owner=owner_i,debit_id=debit_id,category='petrol')
                except Exception as e:
                    debit_id.delete()
                    return Response('please provie correct information',status=status.HTTP_204_NO_CONTENT)
                try:
                    debit_i = Debit.objects.create(owner=owner_i,debit_id=debit_id,date=api_date,remark=api_remark,debit_amount=api_diesel_spend)
                except Exception as e:
                    debit_id.delete()
                    daily_expense_i.delete()
                    return Response('network error.please try again',status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response('network error.please try again',status=status.HTTP_400_BAD_REQUEST)
            #Save daily work ,mix credit, credit .
            try:
                credit_id_i = MixCredit.objects.create(owner=owner_i,date=api_date,category="daily_work")
            except Exception as e:
                return Response('please provide all information',status=status.HTTP_204_NO_CONTENT)
            try:
                daily_work_i = DailyWork.objects.create(credit_id=credit_id_i,name=api_name,village=api_village,vehicle=vehicle_i,five_feet=float(api_five_feet),five_feet_rate=float(api_five_feet_rate),
                                            two_half_feet=float(api_two_half_feet),two_half_feet_rate=float(api_two_half_feet_rate),diesel_spend=float(api_diesel_spend),
                                            net_amount=float(net_amount),date=api_date)
            except Exception as e:
                credit_id_i.delete()
                return Response('daily work not saved,please try again',status=status.HTTP_204_NO_CONTENT)
            try:
                credit_i = Credit.objects.create(owner=owner_i,work=credit_id_i,date=api_date,credit_amount=float(api_received_amount),remark=api_remark)
                return Response('daily work added for party {}'.format(api_name),status=status.HTTP_200_OK)
            except Exception as e:
                daily_work_i.delete()
                credit_id_i.delete()
                return Response('daily work not saved due to some error',status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response('please provide all data',status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class AddMachineSupply(APIView):
    """
    View for supply entry for machine
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        owner = Owner.objects.get(id=1)
        if request.data:
            # get all data from api
            try:
                api_party = request.data['party']
                api_Material = request.data['material']
                api_date = request.data['date']
                api_quantity = request.data['quantity']
                api_drilling_feet = request.data['drilling_feet']
            except Exception as e:
                return Response("please provide all information correctly",status=status.HTTP_204_NO_CONTENT)   
            # get MachineParty instance from databse
            try:
                machine_party_i = MachineParty.objects.get(name=api_party)
            except Exception as e:
                return Response("please provide a valid party name",status=status.HTTP_204_NO_CONTENT)        
            # get Material instance from database
            try:
                Material_i = Material.objects.get(name=api_Material)
            except Exception as e:
                return Response("please provide a valid Material name",status=status.HTTP_204_NO_CONTENT)        
            try:
                machine_supply_create = MachineSupply.objects.create(party=machine_party_i,
                Material=Material_i,date=api_date,quantity=api_quantity,drilling_feet=api_drilling_feet)
                Material_new_quantity = Material_i.quantity - api_quantity
                Material.objects.filter(pk=Material_i.pk).update(quantity=Material_new_quantity)          

                return Response("{} is supplied to {} at {}".format(api_Material,api_party,api_date),status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response("there is error while saving data in database",status=status.HTTP_204_NO_CONTENT)    

class AddVehicleSupply(APIView):
    """
    View for supply entry for vehicle
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        owner = Owner.objects.get(id=1)
        if request.data:
            # get all data from api
            try:
                api_Material = request.data['material']
                api_date = request.data['date']
                api_quantity = request.data['quantity']
            except Exception as e:
                print(e)
                return Response("please provide all information correctly",status=status.HTTP_204_NO_CONTENT)   
            # get Material instance from database
            try:
                Material_i = Material.objects.get(name=api_Material)
            except Exception as e:
                print(e)
                return Response("please provide a valid Material name",status=status.HTTP_204_NO_CONTENT)        
            try:
                vehicle_supply_create = VehicleSupply.objects.create(Material=Material_i,date=api_date,quantity=api_quantity)

                Material_new_quantity = Material_i.quantity - float(api_quantity)
                Material.objects.filter(pk=Material_i.pk).update(quantity=Material_new_quantity)          

                return Response("{} is supplied to {}".format(api_Material,api_date),status=status.HTTP_201_CREATED)
            except Exception as e:
                print(e)
                return Response("there is error while saving data in database",status=status.HTTP_204_NO_CONTENT)                

class AddPart(APIView):
    """
    View for Add Parts
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        owner_i = Owner.objects.get(id=1)
        try:
            api_name = request.data['name']
            api_debit_amount = request.data['debit_amount']
            api_remark = request.data['remark']
            api_date = request.data['date']
        except Exception as e:
            return Response('please provide all information',status=status.HTTP_204_NO_CONTENT)
        try:
            mix_debit_i = MixDebit.objects.create(owner=owner_i,date=api_date,category="part_debit")
        except Exception as e:
            return Response('please provide correct date',status=status.HTTP_404_NOT_FOUND)
        try:
            part_i = Part.objects.create(owner=owner_i,debit_id=mix_debit_i,name=api_name)
        except Exception as e:
            mix_debit_i.delete()
            return Response('part not added',status=status.HTTP_200_OK)
        try:
            debit_i = Debit.objects.create(owner=owner_i,debit_id=mix_debit_i,date=api_date,debit_amount=api_debit_amount,
                                            remark=api_remark)
            return Response('{} part added'.format(api_name),status=status.HTTP_201_CREATED)
        except Exception as e:
            part_i.delete()
            mix_debit_i.delete()
            return Response('part not added,please try again',status=status.HTTP_200_OK)

class AddOwnerDebit(APIView):
    """
    View to add Owner Debit.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_debit_amount = request.data['debit_amount']
            api_date = request.data['date']
            api_remark = request.data['remark']
        except Exception as e:
            return Response('please provide all information',status=status.HTTP_204_NO_CONTENT)
        try:
            debit_id = MixDebit.objects.get(id=2)
            owner_i = Owner.objects.get(id=1)
        except Exception as e:
            return Response('error in debit_id',status=status.HTTP_400_BAD_REQUEST)
        try:
            debit_i = Debit.objects.create(owner=owner_i,debit_id=debit_id,date=api_date,
                                            debit_amount=api_debit_amount,remark=api_remark)
            return Response('Owner Debit added',status=status.HTTP_200_OK)
        except Exception as e:
            return Response('Owner debit not saved',status=status.HTTP_400_BAD_REQUEST)

class AddDailyExpense(APIView):
    """
    View to add Daily Expense.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        owner_i = Owner.objects.get(id=1)
        try:
            api_expense = request.data['expense']
            api_date = request.data['date']
            api_remark = request.data['remark']
            api_category = request.data['category']  # category=('staff','petrol','food','office_accesories',"other")
        except Exception as e:
            return Response('please provide all information',status=status.HTTP_204_NO_CONTENT)
        try:
            debit_id = MixDebit.objects.create(owner=owner_i,date=api_date,category="daily_expense_debit")
        except Exception as e:
            return Response('mix debit not created,please try again')
        try:
            daily_expense_i = DailyExpense.objects.create(owner=owner_i,debit_id=debit_id,category=api_category)
        except Exception as e:
            debit_id.delete()
            return Response('please provie correct information',status=status.HTTP_204_NO_CONTENT)
        try:
            debit_i = Debit.objects.create(owner=owner_i,debit_id=debit_id,date=api_date,remark=api_remark,debit_amount=api_expense)
            return Response('Daily Expense for {} added'.format(api_category),status=status.HTTP_201_CREATED)
        except Exception as e:
            daily_expense_i.delete()
            debit_id.delete()
            return Response('daily expense not added',status=status.HTTP_200_OK)

class AddWorkerStartDate(APIView):
    """
    View to add worker start date.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_name = request.data['name']
            api_start_date = request.data['start_date']
        except Exception as e:
            return Response('please provide all information',status=status.HTTP_204_NO_CONTENT)
        try:
            worker_i = Worker.objects.get(name=api_name)
        except Exception as e:
            return Response('worker does not exists',status=status.HTTP_200_OK)
        try:
            worker_date_i = WorkerDate.objects.create(worker_id=worker_i,start_date=api_start_date)
            return Response('start date for worker {} is saved'.format(api_name),status=status.HTTP_200_OK)
        except Exception as e:
            return Response(e,status=status.HTTP_200_OK)
        return Response('network error,please try again later',status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AddWorkerEndDate(APIView):
    """
    View to add worker End date.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_worker_date_id = request.data['worker_date_id']
            api_end_date = request.data['end_date']
        except Exception as e:
            return Response('please provide all information',status=status.HTTP_200_OK)
        try:
            worker_date_i = WorkerDate.objects.get(pk=api_worker_date_id)
            worker_date_i.end_date=api_end_date
            worker_date_i.save()
            return Response('end date for worker {} is saved'.format(worker_date_i.worker_id),status=status.HTTP_200_OK)
        except Exception as e:
            return Response(e,status=status.HTTP_200_OK)
        return Response('network error,please try again later',status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# APIView for Payment  (post request)
# """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

class MachinePayment(APIView):
    """
    View to change paid status in Machinework model.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        owner_i = Owner.objects.get(id=1)
        try:
            api_party = request.data['party']
            api_start_date = request.data['start_date']
            api_end_date = request.data['end_date']
            api_payment = request.data['payment']
            api_remark = request.data['remark']
        except Exception as e:
            return Response('please provide all information')
        try:
            party_i = MachineParty.objects.get(name=api_party)
        except:
            return Response("party not found for in machine party",status=status.HTTP_404_NOT_FOUND)
        try:
            credit_i = Credit.objects.create(work=party_i.credit_id,date=date.today(),owner=owner_i,remark=api_remark,
            credit_amount=api_payment)
        except Exception as e:
            return Response("payment not succed due to some error",status=status.HTTP_400_BAD_REQUEST)
        try:
            machine_work_i = MachineWork.objects.filter(party=party_i,date__range=[api_start_date,api_end_date])
            if machine_work_i:
                for i in machine_work_i:
                    MachineWork.objects.filter(party=i.party,date=i.date).update(paid=True)
                return Response('Machine Work for party {} from {} to {} is paid'.format(party_i,api_start_date,api_end_date),status=status.HTTP_200_OK)
            else:
                credit_i.delete()
                return Response('No machine work exists for this machine party',status=status.HTTP_200_OK)
        except:
            credit_i.delete()
            return Response('please provide correct date range',status=status.HTTP_400_BAD_REQUEST)
        return Response('no work for this machine party exists.',status=status.HTTP_200_OK)

class VehiclePayment(APIView):
    """
    View to change paid status in vehicleWork model.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        owner_i = Owner.objects.get(id=1)
        try:
            api_party = request.data['party']
            api_start_date = request.data['start_date']
            api_end_date = request.data['end_date']
            api_payment = request.data['payment']
            api_remark = request.data['remark']
        except Exception as e:
            return Response('please provide all information')
        try:
            party_i = VehicleParty.objects.get(name=api_party)
        except:
            return Response("contact not found in vehicle party",status=status.HTTP_404_NOT_FOUND)
        try:
            credit_i = Credit.objects.create(work=party_i.credit_id,date=date.today(),owner=owner_i,remark=api_remark,
            credit_amount=api_payment)
        except Exception as e:
            return Response("payment not succed due to some error",status=status.HTTP_400_BAD_REQUEST)
        try:
            vehicle_work_i = VehicleWork.objects.filter(party=party_i,date__range=[api_start_date,api_end_date])
            if vehicle_work_i:
                for i in vehicle_work_i:
                    VehicleWork.objects.filter(party=i.party,date=i.date).update(paid=True)
                return Response('Vehicle Work Work for party {} from {} to {} is paid'.format(party_i,api_start_date,api_end_date),status=status.HTTP_200_OK)
            else:
                credit_i.delete()
                return Response('no vehicle work exists for this vehicle party',status=status.HTTP_200_OK)
        except Exception as e:
            credit_i.delete()
            return Response('please provide correct date',status=status.HTTP_400_BAD_REQUEST)
        return Response('no work for this vehicle party exists.',status=status.HTTP_200_OK)

class PurchasePayment(APIView):
    """
    View to change paid status in Purchase model.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        owner_i = Owner.objects.get(id=1)
        try:
            api_party = request.data['party']
            api_start_date = request.data['start_date']
            api_end_date = request.data['end_date']
            api_payment = request.data['payment']
            api_remark = request.data['remark']
        except Exception as e:
            return Response('please provide all information')
        try:
            party_i = PurchaseParty.objects.get(name=api_party)
        except Exception as e:
            return Response("purchase party does not exists",status=status.HTTP_404_NOT_FOUND)
        try:
            debit_i = Debit.objects.create(debit_id=party_i.debit_id,date=date.today(),owner=owner_i,remark=api_remark,
            debit_amount=api_payment)
        except Exception as e:
            return Response("payment not succed due to some error",status=status.HTTP_400_BAD_REQUEST)
        try:
            purchase_i = Purchase.objects.filter(party=party_i,date__range=[api_start_date,api_end_date])
            if purchase_i:
                for i in purchase_i:
                    Purchase.objects.filter(party=i.party,date=i.date).update(paid=True)
                return Response('Purchase for party {} from {} to {} is paid'.format(party_i,api_start_date,api_end_date),status=status.HTTP_200_OK)
            else:
                 return Response('No Purchase exists for this purchase party')
        except Exception as e:
            debit_i.delete()
            return Response('please provide correct date',status=status.HTTP_400_BAD_REQUEST)
        return Response('no purchase for this purchase party exists.',status=status.HTTP_200_OK)

class WorkerPayment(APIView):
    """
    View to Get Vehicle Work Detail of a party.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        owner_i = Owner.objects.get(id=1)
        try:
            api_name = request.data['name']
            api_debit_amount = request.data['debit_amount']
            api_remark = request.data['remark']
            api_date = request.data['date']
        except Exception as e:
            return Response('please provide all information',status=status.HTTP_204_NO_CONTENT)
        try:
            worker_i = Worker.objects.get(name=api_name)
        except Exception as e:
            return Response('worker not registered with this name',status=status.HTTP_200_OK)
        try:
            debit_i = Debit.objects.create(owner=owner_i,debit_id=worker_i.debit_id,date=api_date,
                                        debit_amount=api_debit_amount,remark=api_remark)
            return Response('payment for {} is debited'.format(api_name),status=status.HTTP_200_OK)
        except Exception as e:
            return Response("payment not saved due to network error",status=status.HTTP_404_NOT_FOUND)

class UpdateAvgFeet(APIView):
    """
    View to update average feet in machine work during a time period.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_contact = request.data['contact']
            api_avg_feet = request.data['avg_feet']
            api_start_date = request.data['start_date']
            api_end_date = request.data['end_date']
        except Exception as e:
            return Response('please provide all information')
        try:
            party_i = MachineParty.objects.get(contact=api_contact)
        except:
            return Response("contact not found for any machine party",status=status.HTTP_404_NOT_FOUND)
        try:
            machine_work_i = MachineWork.objects.filter(party=party_i,date__range=[api_start_date,api_end_date])
            if machine_work_i:
                for i in machine_work_i:
                    MachineWork.objects.filter(party=i.party,date=i.date).update(average_feet=api_avg_feet)
                return Response('Average feet  for party {} from {} to {} is Updated'.format(party_i,api_start_date,api_end_date),status=status.HTTP_200_OK)
            else:
                 return Response('No machine work exists for this machine party during given date period')
        except:
            return Response('please provide correct date',status=status.HTTP_400_BAD_REQUEST)
        return Response('no work for this machine party exists',status=status.HTTP_200_OK)

# """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# APIView for Details(Work , Credit , Debit,Party,Worker) (post request)
# """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

class MachineWorkDetail(APIView):
    """
    View to get machine work of a party.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_party = request.data['party']
        except Exception as e:
            return Response('please provide all information',status=status.HTTP_204_NO_CONTENT)
        try:
            party_detail = MachineParty.objects.get(name=api_party)
        except Exception as e:
            return Response('machine party does not exists',status=status.HTTP_200_OK)
        try:
            party_work_detail = MachineWork.objects.filter(party=party_detail).values('machine','date','drilling_feet',
                                'diesel_amount','remark','holes','payment','paid').order_by('date')
        except:
            return Response('no work exists for this machine party',status=status.HTTP_200_OK)
        party_detail_json = {'name':party_detail.name,'contact':party_detail.contact,'village':party_detail.village,
                            'crasher':party_detail.crasher,'work':list(party_work_detail)}
        return Response(party_detail_json,status=status.HTTP_200_OK)

class VehicleWorkDetail(APIView):
    """
    View to Get Vehicle Work Detail of a party.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_party = request.data['party']
        except Exception as e:
            return Response('please provide all information',status=status.HTTP_204_NO_CONTENT)
        try:
            party_detail = VehicleParty.objects.get(name=api_party)
        except Exception as e:
            return Response('vehicle party does not exists',status=status.HTTP_200_OK)
        try:
            party_work_detail = VehicleWork.objects.filter(party=party_detail).values('date','feet','five_feet','two_half_feet','paid','remark','payment').order_by('date')
        except:
            return Response('no work exists for this vehicle party',status=status.HTTP_200_OK)
        party_detail_json = {'name':party_detail.name,'contact':party_detail.contact,'village':party_detail.village,
                                    'work':list(party_work_detail)}
        return Response(party_detail_json,status=status.HTTP_200_OK)

class PurchaseDetail(APIView):
    """
    View to Get Vehicle Work Detail of a Purchase.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_party = request.data['party']
        except Exception as e:
            return Response('please provide all information',status=status.HTTP_204_NO_CONTENT)
        try:
            party_detail = PurchaseParty.objects.get(name=api_party)
        except Exception as e:
            return Response('purchase party does not exists',status=status.HTTP_200_OK)
        try:
            purchase_detail = Purchase.objects.filter(party=party_detail).values('date','material','quantity','remark','paid',
                                                    'rate','net_amount','payment').order_by('date')
            for i in purchase_detail:
                material = Material.objects.get(id=i['material'])
                i['material']=material.name
        except Exception as e:
            return Response('no work exists for this purchase party',status=status.HTTP_200_OK)
        party_detail_json = {'name':party_detail.name,'contact':party_detail.contact,'village':party_detail.village,
                                    'purchase':list(purchase_detail)}
        return Response(party_detail_json,status=status.HTTP_200_OK)



class MachinePartyCredit(APIView):
    """
    View to Get Machine Party Credit Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_party = request.data['party']
        except Exception as e:
            return Response('please provide a party name',status=status.HTTP_404_NOT_FOUND)
        try:
            party_i = MachineParty.objects.get(name=api_party)
        except Exception as e:
            return Response('machine party does not exists',status=status.HTTP_404_NOT_FOUND)
        try:
            credit_i = Credit.objects.filter(work=party_i.credit_id).values('date','credit_amount','remark').order_by('date')
        except Exception as e:
            return Response('please provide all information')
        party_credit_detail = {'party':api_party,'contact':party_i.contact,'village':party_i.village,'crasher':party_i.crasher,
                                'credits':list(credit_i)}
        return Response(party_credit_detail,status=status.HTTP_200_OK)

class VehiclePartyCredit(APIView):
    """
    View to Get Vehicle Party Credit Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_party = request.data['party']
        except Exception as e:
            return Response('please provide a party name',status=status.HTTP_404_NOT_FOUND)
        try:
            party_i = VehicleParty.objects.get(name=api_party)
        except Exception as e:
            return Response('vehicle party does not exists',status=status.HTTP_404_NOT_FOUND)
        try:
            credit_i = Credit.objects.filter(work=party_i.credit_id).values('date','credit_amount','remark').order_by('date')
        except Exception as e:
            return Response('please provide all information')
        party_credit_detail = {'party':api_party,'contact':party_i.contact,'village':party_i.village,
                                'credits':list(credit_i)}
        return Response(party_credit_detail,status=status.HTTP_200_OK)

class WorkerDebit(APIView):
    """
    View to Get Worker Debit Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_name = request.data['name']
        except Exception as e:
            return Response('please provide a worker name',status=status.HTTP_404_NOT_FOUND)
        try:
            worker_i = Worker.objects.get(name=api_name)
        except Exception as e:
            return Response('worker does not exists',status=status.HTTP_404_NOT_FOUND)
        try:
            debit_i = Debit.objects.filter(debit_id=worker_i.debit_id).values('date','debit_amount','remark').order_by('date')
        except Exception as e:
            return Response('please provide all information')
        worker_debit_detail = {'name':api_name,'contact':worker_i.contact,'village':worker_i.village,
                                'debit':list(debit_i)}
        return Response(worker_debit_detail,status=status.HTTP_200_OK)

class PurchasePartyDebit(APIView):
    """
    View to Get Purchase Party dedit Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_party = request.data['party']
        except Exception as e:
            return Response('please provide a party name',status=status.HTTP_404_NOT_FOUND)
        try:
            party_i = PurchaseParty.objects.get(name=api_party)
        except Exception as e:
            return Response('purchase party does not exists',status=status.HTTP_404_NOT_FOUND)
        try:
            dedit_i = Debit.objects.filter(debit_id=party_i.debit_id).values('date','debit_amount','remark').order_by('date')
        except Exception as e:
            return Response('please provide all information')
        party_credit_detail = {'party':api_party,'contact':party_i.contact,'village':party_i.village,
                                'debits':list(dedit_i)}
        return Response(party_credit_detail,status=status.HTTP_200_OK)

class WorkerDateDetail(APIView):
    """
    View to Get Worker Dates Detail.
    api_ is for indication that this data in came from api
    _i is for indication that this data is a model instance
    """
    def post(self,request):
        try:
            api_name = request.data['name']
        except Exception as e:
            return Response('worker does not exists',status=status.HTTP_200_OK)
        try:
            worker_i = Worker.objects.get(name=api_name)
        except Exception as e:
            return Response('Worker Does not exists',status=status.HTTP_200_OK)
        try:
            worker_date_i = WorkerDate.objects.filter(worker_id=worker_i).values('start_date','end_date','pk').order_by('start_date')
            for i in worker_date_i:
                i['worker_date_id']=i['pk']
                del i['pk']
            worker_date_details = {"name":worker_i.name,"contact":worker_i.contact,"village":worker_i.village,
                                     "date":list(worker_date_i)}
            return Response(worker_date_details,status=status.HTTP_200_OK)
        except Exception as e:
            return Response('worker date not available',status=status.HTTP_400_BAD_REQUEST)
        return Response('network error,please try again later',status=status.HTTP_500_INTERNAL_SERVER_ERROR)