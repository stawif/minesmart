# Generated by Django 3.0.3 on 2020-03-24 17:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('database', '0002_remove_worker_exit_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='WorkerDate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField()),
                ('end_date', models.DateField(blank=True, null=True)),
                ('worker_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.Worker')),
            ],
        ),
    ]