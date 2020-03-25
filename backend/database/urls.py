from django.urls import path
from .views import (AddMachine , MachineList , VehicleList , AddVehicle , AddRecorder , MaterialList , AddMaterial,
                    MachinePartyList , PurchasePartyList,VehiclePartyList , AddMachineParty , AddPurchaseParty , 
                    AddVehicleParty,AddMachineWork,AddVehicleWork,AddWorker,AddPurchase, WorkerList,AddDailyWork,
                    AddMachineSupply,AddVehicleSupply,MachinePayment,UpdateAvgFeet,AddPart,PartList,PurchaseList,
                    WorkerList, PartyContact,VehiclePayment,PurchasePayment,MachineWorkDetail,VehicleWorkDetail,
                    PartyThroughContact,AddOwnerDebit,OwnerDebitList,AddDailyExpense,DailyExpenseList,WorkerPayment,
                    PurchaseDetail,MachinePartyCredit,VehiclePartyCredit,DailyWorkCredit,DailyExpenseDedit,
                    PartDedit,WorkerDebit,PurchasePartyDebit,DailyWorkList,CreditList,DebitList,MachineSupplyList,
                    VehicleSupplyList,AddWorkerStartDate,WorkerDateDetail,AddWorkerEndDate,AccountDetail,OwnerAccountDetail)

urlpatterns = [
    # """
    # list-of-url 
    # """
    path('list-of-partycontacts/',PartyContact),
    path('list-of-machines/',MachineList.as_view()),
    path('list-of-vehicles/',VehicleList.as_view()),
    path('list-of-material/',MaterialList.as_view()),
    path('list-of-worker/',WorkerList.as_view()),
    path('list-of-part/',PartList.as_view()),
    path('list-of-dailyexpense/',DailyExpenseList.as_view()),
    path('list-of-ownerdebit/',OwnerDebitList.as_view()),
    path('list-of-machineparty/',MachinePartyList.as_view()),
    path('list-of-vehicleparty/',VehiclePartyList.as_view()),
    path('list-of-purchaseparty/',PurchasePartyList.as_view()),
    path('list-of-purchase/',PurchaseList.as_view()),
    path('party-through-contact/', PartyThroughContact.as_view()),
    path('daily-work-credit/',DailyWorkCredit.as_view()),
    path('daily-expense-debit/',DailyExpenseDedit.as_view()),
    path('part-debit/',PartDedit.as_view()),
    path('list-of-daily-work/',DailyWorkList.as_view()),
    path('list-of-credit/',CreditList.as_view()),
    path('list-of-debit/',DebitList.as_view()),
    path('list-of-machinesupply/',MachineSupplyList.as_view()),
    path('list-of-vehiclesupply/',VehicleSupplyList.as_view()),
    path('account-detail/',AccountDetail.as_view()),
    path('owner-account-detail/',OwnerAccountDetail.as_view()),
    # """
    # Registration URL
    # """
    path('vehicle-registration/',AddVehicle.as_view()),
    path('worker-registration/',AddWorker.as_view()),
    path('recorder-registration/',AddRecorder.as_view()),
    path('material-registration/',AddMaterial.as_view()),
    path('machine-party-registration/',AddMachineParty.as_view()),
    path('vehicle-party-registration/',AddVehicleParty.as_view()),
    path('purchase-party-registration/',AddPurchaseParty.as_view()),
    path('machine-registration/',AddMachine.as_view()),
    # """
    # enter-work url 
    # """
    path('enter-machineparty-work/',AddMachineWork.as_view()),
    path('enter-vehicleparty-work/',AddVehicleWork.as_view()),
    path('enter-purchase-detail/',AddPurchase.as_view()),
    path('enter-daily-work/',AddDailyWork.as_view()),
    path('enter-machine-supply/',AddMachineSupply.as_view()),
    path('enter-vehicle-supply/',AddVehicleSupply.as_view()),
    path('enter-part/',AddPart.as_view()),
    path('enter-owner-debit/',AddOwnerDebit.as_view()),
    path('enter-daily-expense/',AddDailyExpense.as_view()),
    path('enter-worker-start-date/',AddWorkerStartDate.as_view()),
    path('enter-worker-end-date/',AddWorkerEndDate.as_view()),
    # """
    # Payment url
    # """
    path('machine-payment/',MachinePayment.as_view()),
    path('worker-payment/',WorkerPayment.as_view()),
    path('vehicle-payment/',VehiclePayment.as_view()),
    path('purchase-payment/',PurchasePayment.as_view()),
    path('update-avgfeet/',UpdateAvgFeet.as_view()),
    # """
    # Detail(Work,Credit,Debit) URL
    # """
    path('machine-work-detail/',MachineWorkDetail.as_view()),
    path('vehicle-work-detail/',VehicleWorkDetail.as_view()),
    path('purchase-detail/',PurchaseDetail.as_view()),
    path('machine-party-credit/',MachinePartyCredit.as_view()),
    path('vehicle-party-credit/',VehiclePartyCredit.as_view()),
    path('worker-debit/',WorkerDebit.as_view()),
    path('purchase-party-debit/',PurchasePartyDebit.as_view()),
    path('worker-date-detail/',WorkerDateDetail.as_view()),
]