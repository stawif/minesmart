from django.db import models
from django.dispatch import receiver
from django.db.models.signals import pre_save,post_save
from datetime import datetime  

class Owner(models.Model):
    """
    Owner is the actor for which this application is build    
    """
    name = models.CharField(max_length=30,blank=False,unique=True)
    username = models.CharField(max_length=30,blank=False,unique=True)
    password = models.CharField(max_length=30,blank=False)
    contact = models.IntegerField(blank=False)

    def __str__(self):
        return self.name    

@receiver(post_save, sender= Owner)
def gen_daily_expense_debit_id(sender, instance, **kwarge):
    daily_expense_i = MixDebit(owner=instance, date=datetime.now().strftime ("%Y-%m-%d"))
    daily_expense_i.save()
    owner_debit_i = MixDebit(owner=instance, date=datetime.now().strftime ("%Y-%m-%d"),category="owner_debit")
    owner_debit_i.save()



class Machine(models.Model):
    """
    Machines are assets of owner which are used in Work
    """
    owner = models.ForeignKey(Owner,on_delete=models.CASCADE)    
    name = models.CharField(primary_key=True,max_length=30,blank=False,unique=True)
  
    def __str__(self):
        return self.name    

class Vehicle(models.Model):
    """
    Vehicles are assets of owner which are used in Work
    """
    owner = models.ForeignKey(Owner,on_delete=models.CASCADE)    
    name = models.CharField(max_length=30,blank=False,unique=True)

    def __str__(self):
        return self.name    

class Recorder(models.Model):
    """
    Recorder is a employee of owner who has job of data entry in this application
    """
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    username = models.CharField(max_length=30,blank=False,unique=True)
    password = models.CharField(max_length=30,blank=False)

    def __str__(self):
        return self.username    

class Material(models.Model):
    """
    Material is for keeping records of things used by owner in works for party
    """
    owner = models.ForeignKey(Owner,on_delete=models.CASCADE)
    name = models.CharField(max_length=30, blank=False)
    measurement = models.CharField(max_length=30, blank=False)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return self.name    

@receiver(pre_save, sender=Material)
def check_Material_availability(sender,instance,**kwarge):
    all_Materials = sender.objects.filter(owner=instance.owner)
    for Material in all_Materials:
        if instance.name.lower() == Material.name.lower():
            raise Exception('Name of Material is already exist')

# class Party(models.Model):
#     """
#     Party are the entity which gives work to owner
#     """
#     owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
#     contact = models.IntegerField(primary_key=True, blank=False)
#     village = models.CharField(max_length=30,blank=False)
#     date = models.DateField(default=datetime.now,blank=False)  #Add aunto now date
#     total_credit = models.IntegerField(default=0)   

#     def __str__(self):
#         return str(self.pk)    

credit_category=(
    ('machine_party','machine_party'),
    ('vehicle_party','vehicle_party'),
    ('daily_work','daily_work')
)

class MixCredit(models.Model):
    """
    A class to generalize credit type
    """
    owner = models.ForeignKey(Owner,on_delete=models.CASCADE)
    date = models.DateField(blank=False,auto_now_add=True)
    category = models.CharField(max_length=100, choices=credit_category,null=True)

    def __str__(self):
        return str(self.pk)

@receiver(post_save, sender= Owner)
def gen_daily_expense_credit_id(sender, instance, **kwarge):
    daily_expense_i = MixCredit(owner=instance, date=datetime.now().strftime ("%Y-%m-%d"))
    daily_expense_i.save()
    

"""
Above models are complete
"""

debit_category = (
    ('part_debit','part_debit'),
    ('owner_debit','owner_debit'),
    ('purchase_debit','purchase_debit'),
    ('worker_debit','worker_debit'),
    ('daily_expense_debit','daily_expense_debit')
)

class MixDebit(models.Model):
    """
    A class to generalize debit type
    """
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    date = models.DateField(default=datetime.now, blank=False)
    category = models.CharField(max_length=100,choices=debit_category,null=True)

    def __str__(self):
        return str(self.pk)


class PurchaseParty(models.Model):
    """
    Parties that gives work related to purchase
    """
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    debit_id = models.OneToOneField(MixDebit, on_delete=models.CASCADE)
    name = models.CharField(max_length=30,blank=False)
    contact = models.IntegerField(blank=False)
    village = models.CharField(max_length=50, blank=False)

    def __str__(self):
        return self.name


class Worker(models.Model):
    """
    Workers are also employees od owner who do work for owner
    """
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    debit_id = models.OneToOneField(MixDebit,on_delete=models.CASCADE)
    name = models.CharField(max_length=30,blank=False)
    contact = models.IntegerField(blank=False)
    village = models.CharField(max_length=30,blank=False)
    salary = models.IntegerField(blank=False)

    def __str__(self):
        return self.name    

class MachineParty(models.Model):
    """
    Parties that gives work related to machine
    """
    credit_id = models.ForeignKey(MixCredit,on_delete=models.CASCADE)
    name = models.CharField(max_length=30,blank=False)
    contact = models.IntegerField(blank=False)
    village = models.CharField(max_length=50,blank=False)
    crasher = models.CharField(max_length=50,blank=False)

    def __str__(self):  
        return self.name


class VehicleParty(models.Model):
    """
    Parties that gives work related to vehicle
    """
    credit_id = models.ForeignKey(MixCredit,on_delete=models.CASCADE)
    name = models.CharField(max_length=30,blank=False)
    contact = models.IntegerField(blank=False)
    village = models.CharField(max_length=50,blank=False)

    def __str__(self):
        return self.name

    


class MachineWork(models.Model):
    """
    This is a type of work owner do for party in mining
    """
    party = models.ForeignKey(MachineParty, on_delete=models.CASCADE)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)    
    date = models.DateField()
    drilling_feet = models.FloatField(blank=False)
    diesel_amount = models.FloatField(blank=False)
    remark = models.CharField(max_length=50, blank=True)
    paid = models.BooleanField(default=False)
    holes = models.IntegerField(default=0)
    payment = models.FloatField(default=0)
    
    # def __str__(self):
    #     return self.party," ",str(self.date)    

    def __str__(self):
        template = '{0.party} {0.date}'
        return template.format(self)

    class Meta:
        unique_together = (("party", "date"),)  #One work for a party for a single day

class VehicleWork(models.Model):
    """
    This is a type of work owner do for a party 
    """
    party = models.ForeignKey(VehicleParty, on_delete=models.CASCADE)
    date = models.DateField()
    feet = models.FloatField(blank=False)
    five_feet = models.FloatField(blank=False)
    two_half_feet = models.FloatField(blank=False)
    remark = models.CharField(max_length=50, blank=True)
    paid = models.BooleanField(default=False)
    payment = models.FloatField(default=0)

    def __str__(self):
        template = '{0.party} {0.date}'
        return template.format(self)       

    class Meta:
        unique_together = (("party", "date"),)      #one work for a party for a single day

class DailyWork(models.Model):
    """
    This is a type of  work owner do for a party
    """
    credit_id = models.OneToOneField(MixCredit,on_delete=models.CASCADE)
    name = models.CharField(max_length=50,blank=False)
    village = models.CharField(max_length=50,blank=False)
    vehicle = models.ForeignKey(Vehicle,on_delete=models.CASCADE)
    five_feet = models.FloatField(blank=False)
    five_feet_rate = models.FloatField(blank=False)
    two_half_feet = models.FloatField(blank=False)
    two_half_feet_rate = models.FloatField(blank=False)
    diesel_spend = models.FloatField(blank=False)
    net_amount = models.FloatField(blank=False)
    date = models.DateField(blank=False)

    def __str__(self):
        return self.name      

class Purchase(models.Model):
    """
    Purchase records of owner from any party
    """
    party = models.ForeignKey(PurchaseParty, on_delete=models.CASCADE)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    date = models.DateField(default=datetime.now, blank=False)    
    quantity = models.IntegerField(blank=False)
    rate = models.FloatField(blank=False)
    net_amount = models.FloatField(blank=False)
    remark = models.CharField(max_length=50, blank=True)
    paid = models.BooleanField(default=False)
    payment = models.FloatField(blank=False)

    def __str__(self):
        return str(self.party)    

class VehicleSupply(models.Model):
    """
    Records of Materials supplied to any work
    """    
    Material = models.ForeignKey(Material, on_delete=models.CASCADE)
    date = models.DateField()
    quantity = models.FloatField(blank=False)

    def __str__(self):
        return str(self.pk)    

class MachineSupply(models.Model):
    """
    Records of Materials supplied to any work
    """    
    party = models.ForeignKey(MachineParty, on_delete=models.CASCADE)
    Material = models.ForeignKey(Material, on_delete=models.CASCADE)
    date = models.DateField()
    quantity = models.IntegerField(blank=False)
    drilling_feet = models.FloatField(default=0)

    def __str__(self):
        return str(self.pk)    


class Account(models.Model):
    """
    Account of owner about it's overall credit, debit and current balance
    """
    owner = models.OneToOneField(Owner, on_delete=models.CASCADE)
    total_credit = models.IntegerField(default=0)
    total_debit = models.IntegerField(default=0)
    balance = models.IntegerField(default=0)    

    def __str__(self):
        return self.owner    

class Credit(models.Model):
    """
    Credit history of owner account
    """
    work = models.ForeignKey(MixCredit, on_delete=models.CASCADE)
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    date = models.DateField(blank=False)
    credit_amount = models.FloatField(blank=False)
    remark = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return str(self.work)


class Debit(models.Model):
    """
    Debit history of owner account
    """
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    debit_id = models.ForeignKey(MixDebit, on_delete=models.CASCADE)
    date = models.DateField(blank=False)
    debit_amount = models.IntegerField(blank=False)
    remark = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return str(self.debit_id)   

class Part(models.Model):
    """
    Model for Parts Entry.
    """
    owner = models.ForeignKey(Owner,on_delete=models.CASCADE)
    debit_id = models.ForeignKey(MixDebit,on_delete=models.CASCADE)
    name = models.CharField(blank=False,max_length=50)

    def __str__(self):
        template = '{0.name}'
        return template.format(self)

category=(
    ('staff','staff'),
    ('petrol','petrol'),
    ('food','food'),
    ('office_accesories','office_accesories'),
    ('other','other')
)

class DailyExpense(models.Model):
    """
    Model for Daily Expense.
    """
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    debit_id = models.OneToOneField(MixDebit,on_delete=models.CASCADE)
    category = models.CharField(max_length=50,choices=category)

    def __str__(self):
        return str(self.debit_id)

class WorkerDate(models.Model):
    """
    Model for Worker Date.
    """
    worker_id = models.ForeignKey(Worker,on_delete=models.CASCADE)
    start_date = models.DateField(null=False)
    end_date = models.DateField(blank=True,null=True)

    def __str__(self):
        return str(self.id)