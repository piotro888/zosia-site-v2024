# Generated by Django 3.2.16 on 2023-01-02 12:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='qa',
            name='priority',
            field=models.PositiveSmallIntegerField(default=0, verbose_name='Priority'),
        ),
    ]
