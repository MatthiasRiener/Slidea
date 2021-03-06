from flask import Blueprint, render_template, redirect, url_for, request,  current_app as app
from flask_oidc import OpenIDConnect
from oauth2client.client import OAuth2Credentials
from .custom_oidc_socket import logoutSession
from ...db.settings import db, oidc

from ..profile.controllers import profile

from ...models.Statistic import Statistic

import json
import datetime
import time

from ...models.User import User
from ...repository.AuthenticationRepository import AuthenticationRepository


from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt, set_access_cookies, get_jti,
                                set_refresh_cookies, unset_jwt_cookies, decode_token)


repo = AuthenticationRepository(testing=False)

auth = Blueprint('auth', __name__, static_folder="static",
                 template_folder="templates")





@auth.route('/login')
@oidc.require_login
def login():
    user_creds = oidc.user_getinfo(
        ['preferred_username', 'email', 'sub', 'roles'])
        
    user_id = user_creds.get('sub')
    user_name = user_creds.get('preferred_username')
    user_mail = user_creds.get('email')
    # test to get user

    print("CREDSS")
    print(user_creds)
    # insert new interaction
    Statistic(name="login", date=time.time(), user=user_id).save()
    

    if "roles" in user_creds:
        access_token = create_access_token(identity=user_id, expires_delta=datetime.timedelta(seconds=10), user_claims={"is_administrator": ("slidea_admin" in user_creds["roles"])})
        refresh_token = create_refresh_token(identity=user_id, user_claims={"is_administrator": ("slidea_admin" in user_creds["roles"])} )
        user = repo.createUser(user_id=user_id, name=user_name, email=user_mail, img=None, last_login=time.time(), created=time.time(), is_admin=("slidea_admin" in user_creds["roles"]) )


    else:
        access_token = create_access_token(identity=user_id, expires_delta=datetime.timedelta(seconds=10), user_claims={"is_administrator": False})
        refresh_token = create_refresh_token(identity=user_id, user_claims={"is_administrator": False})
        user = repo.createUser(user_id=user_id, name=user_name, email=user_mail, img=None, last_login=time.time(), created=time.time(), is_admin=False)


    redir = render_template('/profile/index.html',
                            access=access_token, refresh=refresh_token, loginSucceeded=True)
    return redir


@auth.route('/logout', methods=['GET'])
def logout():
    if oidc.user_loggedin:
        refresh_token = oidc.get_refresh_token()
        access_token = oidc.get_access_token()

        logoutSession(refresh_token, access_token)
        oidc.logout()
    #logoutSession(refresh_token, access_token)
    return json.dumps({"success": 1})


@auth.route('/test')
@jwt_required
def test():
    current_user = get_jwt_identity()
    print(current_user)
    return 'moin!'


@auth.route('/isAdmin')
@jwt_required
def isAdmin():
    u_id = get_jwt_identity()
    claims = get_raw_jwt()

    return json.dumps({"res": claims["user_claims"]["is_administrator"]})

@auth.route('/refresh_token', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    claims = get_raw_jwt()
    print("TOKEN REFRESHED")
    print(claims["user_claims"]["is_administrator"])

    if claims["user_claims"]["is_administrator"]:
        print("REFRESHING TOKEN WITH ADMIN RIGHTS")
        access_token = create_access_token(identity=current_user, user_claims={"is_administrator": True})
    else:
        access_token = create_access_token(identity=current_user, user_claims={"is_administrator": False})

    print("current user: %s" % current_user)
    return access_token


@auth.route('authorization_complete')
def redirectProfile():
    return redirect(url_for('profile.index'))

@auth.route('/getUserID')
@jwt_required
def getUserID():
    return json.dumps({"u_id": get_jwt_identity()})