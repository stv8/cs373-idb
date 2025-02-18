# ---------------------------
# cs373-idb/db_populate_comic_issue_and_vol.py
# Copyright (C) 2015
# Swetarts
# ---------------------------

from server import db
import models
import requests
import json

comic_id_list = ['6422','105342','14667','105403','6694','6686','33921','6428','5883','105764','105811','37736','30769','8428','34018','107870','6023','7072','105683','108764','35666','12422','34415','27158','36544','68545','4189','4190','4191','4192','4193','4194','4195','4196','4197','4198','4199','4201','4202','4203','4204','4205','4207','4208','4209','4210','4211','4213','4214','4215','4217','4218','4219','4220','4221','4223','4225','4226','4227','4229','4230','4231','4232','4233','4234','4235','4236','4238','4239','4240','4241','4242','4243','4244','4245','4246','4248','4249','4251','4252','4253','4255','4256','4257','4258','4259','4260','4261','4267','4268','4269','4270','4271','4272','4273','4274','4275','4276','4278','4279','4280','4281','4282','4283','4284','4285','4287','4288','4290','4291','4292','4293','4295','4296','4297','4299','4300','4301','4302','4304','4305','4306','4307','4308','4310','4311']

request_url = 'http://www.comicvine.com/api/issue/4000-'
payload = {'api_key':'83ff911e240812bc29cf73246626fe319a6a4b71', 'format':'json', 'field_list':'id,name,image,cover_date,issue_number,deck,person_credits,character_credits,volume', 'offset':'0'}
for comic_id in list(comic_id_list):
    api_request = request_url + comic_id + '/'
    response = requests.get(api_request, params=payload)
    num_results = response.json()['number_of_total_results']

    parsed = response.json()['results']
    
    id = parsed['id']
    # print(id)

    title = parsed['name']
    # print(name)

    image = parsed['image']['icon_url']
    # print(images)

    cover_date = parsed['cover_date'].split(' ')[0]
    # print(launch_date)

    issue_num = parsed['issue_number']
    # print(issue_num)

    description = parsed['deck']
    # print(description)

    volume_id = parsed['volume']['id']
    # print(volume_id)

    # Check for existance of volume
    volume_exists = db.session.query(models.Comic_Volume).filter_by(id=int(volume_id)).first()
    if volume_exists == None:

        volume_request = 'http://www.comicvine.com/api/volume/4050-'
        vol_payload = {'api_key':'83ff911e240812bc29cf73246626fe319a6a4b71', 'format':'json', 'field_list':'id,name,image,count_of_issues,deck,start_year,publisher'}
        vol_request = volume_request + str(volume_id) + '/'
        vol_response = requests.get(vol_request, params=vol_payload)

        vol_parsed = vol_response.json()['results']

        vol_id = vol_parsed['id']
        # print(vol_id)

        vol_title = vol_parsed['name']
        # print(vol_title)

        vol_image = vol_parsed['image']['icon_url']
        # print(vol_image)

        vol_num_issues = vol_parsed['count_of_issues']
        # print(vol_num_issues)

        vol_description = vol_parsed['deck']
        # print(vol_description)

        vol_launch_year = vol_parsed['start_year']
        # print(vol_launch_year)

        vol_publisher_id = vol_parsed['publisher']['id']
        # print(vol_publisher_id)

        volume = models.Comic_Volume(id=int(vol_id), title=vol_title, image=vol_image, num_issues=vol_num_issues, description=vol_description, launch_year=int(vol_launch_year), publisher_id=vol_publisher_id)

        db.session.add(volume)
        db.session.commit()

    # Create Comic_Issue object

    comic = models.Comic_Issue(id=int(id), title=title, image=image, cover_date=cover_date, issue_num=issue_num, description=description, volume_id=volume_id)

    #Add featured characters
    characters = parsed['character_credits']
    for character in list(characters):
        hero = db.session.query(models.Character).filter_by(id=int(character['id'])).first()
        if hero:
            comic.characters.append(hero)
        # print(ally['id'], ally['name'])

    #Add featured people
    creators = parsed['person_credits']
    for creator in list(creators):
        person = db.session.query(models.Person).filter_by(id=int(creator['id'])).first()
        if person:
            comic.people.append(person)

    db.session.add(comic)
    db.session.commit()

    
    # print('****************************************************************************************************')