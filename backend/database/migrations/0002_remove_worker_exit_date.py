# Generated by Django 3.0.3 on 2020-03-23 02:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('database', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='worker',
            name='exit_date',
        ),
    ]
