# Generated by Django 5.0.3 on 2024-05-22 13:13

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('login42', models.CharField(max_length=50, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('token', models.CharField(max_length=255)),
            ],
            options={
                'verbose_name_plural': 'Users',
            },
        ),
    ]