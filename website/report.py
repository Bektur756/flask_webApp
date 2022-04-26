from datetime import date, datetime, timedelta
from flask import Blueprint, render_template, request, jsonify, flash
from flask_login import login_required, current_user
from .models import Task
from sqlalchemy import func
from . import db


report = Blueprint('report', __name__)


@report.route("/report/delete/<int:task_id>", methods=['POST'])
def delete(task_id):

    try:
        task = Task.query.get(task_id)
        if task:
            db.session.delete(task)
            db.session.commit()
            flash('task has been deleted', 'success')
        return jsonify()

    except:
        flash('task could not been deleted', 'error')
        return jsonify()


@report.route("/report/edit/<int:task_id>", methods=['POST'])
def update(task_id):
    """ recieved post requests for entry updates """
    updated_task_dict = request.get_json()
    print(task_id)
    try:
        if "status" in updated_task_dict:
            Task.query.filter_by(id=task_id).update(dict(status=updated_task_dict['status']))
            db.session.commit()
        elif 'description' in updated_task_dict:
            print("condition works")
            Task.query.filter_by(id=task_id).update(dict(task=updated_task_dict['description']))
            db.session.commit()
        else:
            flash('Nothing to update', 'error')
    except:
        flash('Nothing to update', 'error')

    finally:
        return jsonify()


@report.route("/report/create", methods=['POST'])
def create():
    """ recieves post requests to add new task """
    task_dict = request.get_json()
    task = task_dict.get('description')
    if len(task) < 1:
        flash('Task is not written!', category='error')
    else:
        new_task = Task(task=task, status="Todo")
        db.session.add(new_task)
        db.session.commit()
        flash('Note added!', category='success')
        return jsonify()


@report.route("/report")
@login_required
def homepage():
    """ returns rendered homepage """
    items = Task.query.all()
    day_of_week_str = 'Monday'

    # items = Task.query.filter(Task.time_updated > datetime.today().weekday() - 7).all()

    return render_template("report.html", user=current_user, items=items)
