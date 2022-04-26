from flask import Blueprint, render_template, request, flash, current_app
from openpyxl import load_workbook
from werkzeug.utils import secure_filename
import pandas as pd
from flask_login import login_required, current_user
import os

configurator = Blueprint('configurator', __name__)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'xlsx', 'xls'}


@configurator.route('/configurator', methods=['GET', 'POST'])
@login_required
def upload_excel():
    if request.method == 'POST':
        upload_excel = request.files['xlsxFile']
        if upload_excel.filename != '' and allowed_file(upload_excel.filename):
            wb = load_workbook(upload_excel)
            ws = wb.active

            flash('File has been uploaded', 'success')

            return render_template('make_config.html', user=current_user, conn_name=upload_excel.filename, work_sheet=ws)
        else:
            flash('No selected file', 'error')
    else:
        return render_template('configurator.html', user=current_user)


@configurator.route('/config_script', methods=['GET', 'POST'])
@login_required
def config_script():

    return render_template("make_config.html", user=current_user, conn_name='', work_sheet='')


    # filename = secure_filename(upload_excel.filename)
    # print(os.path)
    # upload_excel.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
    # data = pd.read_excel(upload_excel)