<?php
/**
 * @var $fileForm PollFileForm
 */
?>

<script type="text/javascript" id="def-fields-json"><?= json_encode(__(Poll::$defFields)) ?></script>

<form id="file-form" class="form-horizontal next-step"  method="post" enctype="multipart/form-data">
    <fieldset>
        <legend><?= __('Upload new file') ?></legend>
        <div class="control-group">
            <label class="control-label"><?= __('File') ?></label>
            <div class="controls">
                <label id="fine-uploader" class="qq-uploader">
                    <div class="btn qq-upload-button"><?= __('Select CSV file') ?></div>
                    <div class="qq-upload-drop-area hide"></div>
                    <ul class="qq-upload-list">
                        <li>
                            <span class="qq-upload-file"></span>
                            <div class="hide">
                                <span class="qq-upload-size"></span>
                                <div class="qq-progress-bar"></div>
                                <span class="qq-upload-spinner"></span>
                                <span class="qq-upload-finished"></span>
                                <a class="qq-upload-cancel" href="#">{cancelButtonText}</a>
                                <a class="qq-upload-retry" href="#">{retryButtonText}</a>
                                <span class="qq-upload-status-text">{statusText}</span>
                            </div>
                        </li>
                    </ul>
                </label>
                <div class="progress progress-striped active">
                    <div class="bar" id="progress" style="width: 0%;"></div>
                </div>
            </div>
        </div>
        <div class="form-actions">
            <button class="btn" id="upload" disabled="disabled"><?= __('Next step') ?> <i class="icon-chevron-right"></i></button>
        </div>
    </fieldset>
</form>

<form id="main-form" class="form-horizontal" method="post" action="<?= url_for('dialer/addList') ?>">

    <!-- Parse csv file -->

    <?= $fileForm->renderHiddenFields() ?>

    <input type="hidden" id="origin-file-name" value="list.csv"/>

    <fieldset class="next-step">
        <legend><?= __('Configure file format') ?></legend>
        <div class="control-group">
            <label class="control-label"><?= __('Name of list') ?></label>
            <div class="controls">
                <?= $fileForm['name'] ?>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label"><?= __('File encoding') ?></label>
            <div class="controls">
                <select id="encoding" name="encoding">
                    <option value="UTF-8"><?= __('UTF-8') ?></option>
                    <option value="ISO-8859-1"><?= __('ISO-8859-1') ?></option>
                    <option value="Windows-1251"><?= __('Windows-1251') ?></option>
                </select>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label"><?= __('Delimiter') ?></label>
            <div class="controls">
                <select id="separator" name="separator">
                    <option value=";"><?= __('Semicolon') ?></option>
                    <option value="	"><?= __('Tab') ?></option>
                    <option value=","><?= __('Comma') ?></option>
                    <option value=" "><?= __('Space') ?></option>
                </select>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label"><?= __('Text delimiter') ?></label>
            <div class="controls">
                <input type="text" value='"' class="input-mini" id="delimiter" name="delimiter">
            </div>
        </div>
        <div class="control-group">
            <label class="control-label"><?= __('Start from row') ?></label>
            <div class="controls">
                <input type="text" value="1" class="input-mini" id="offset" name="offset">
            </div>
        </div>
        <div class="control-group">
            <label class="control-label"><?= __('Columns') ?></label>
            <div class="controls">
                <div class="csv-head" id="field-list">
                    <div></div>
                </div>
                <div class="well well-small form-inline" id="add-custom-field">
                    <input type="text"/> <button type="button" class="btn"><?= __('Add') ?></button>
                </div>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label"><?= __('Preview') ?></label>
            <div class="controls">
                <button type="button" id="update" class="btn"><?= __('Update') ?></button>
                <table id="csv-table" class="csv-table">
                    <thead class="csv-head"><tr></tr></thead>
                    <tbody>
                    <tr>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="form-actions">
            <button type="button" class="btn prev-step"><i class="icon-chevron-left"></i> <?= __('Prev step') ?></button>
            <button type="button" id="parse" class="btn"><?= __('Next step') ?> <i class="icon-chevron-right"></i></button>
        </div>
    </fieldset>

    <!-- Convert phones -->

    <fieldset class="next-step">
        <legend><?= __('Check phone numbers') ?></legend>
        <div class="control-group">
            <label class="control-label"><?= __('Count of phones') ?></label>
            <div class="controls">
                <label class="text" id="total-phones">0</label>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label"><?= __('Count of invalid phones') ?></label>
            <div class="controls">
                <label class="text" id="unvalid-count">0</label>
            </div>
        </div>
        <div class="control-group hide" id="exclude-list">
            <label class="control-label"><?= __('Excluded phones') ?></label>
            <div class="controls">
                <table>
                    <thead>
                    <tr>
                        <th><?= __('Phone') ?></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><span></span></td>
                        <td><a href="#" class="delete-icon"></a></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label"><?= __('Phone formats') ?></label>
            <div class="controls">
                <table id="formats">
                    <thead>
                    <tr>
                        <th><?= __('Input number') ?></th>
                        <th><?= __('Prefix') ?></th>
                        <th><?= __('Output number') ?></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="phone-format">
                        <td class="chars">
                            <ul>
                                <li>
                                    <div class="value">1</div>
                                    <div><input type="checkbox" checked="checked"></div>
                                </li>
                            </ul>
                        </td>
                        <td class="prefix">
                            <input type="text" class="input-mini"/>
                        </td>
                        <td class="result"></td>
                        <td><a href="#" class="delete-icon"></a></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="control-group" id="unvalid-list">
            <label class="control-label"><?= __('First 10 invalid phones') ?></label>
            <div class="controls">
                <table>
                    <tr>
                        <td><span></span></td>
                        <td>
                            <button type="button" class="btn btn-mini use-as-format"><?= __('Use as format') ?></button>
                            <button type="button" class="btn btn-mini exclude"><?= __('Exclude') ?></button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="control-group hide">
            <label class="control-label"><?= __('Progress') ?></label>
            <div class="controls">
                <div class="progress progress-striped active">
                    <div class="bar" id="import-progress" style="width: 0%;"></div>
                </div>
            </div>
        </div>
        <div class="form-actions">
            <button type="button" class="btn prev-step"><i class="icon-chevron-left"></i> <?= __('Prev step') ?></button>
            <button type="button" class="btn btn-primary" id="import"><?= __('Import') ?></button>
        </div>
    </fieldset>
</form>

<form class="form-horizontal next-step" id="info-form">

    <!-- Show import info -->

    <input type="hidden" name="file_id"/>

    <fieldset>
        <legend><?= __('Imported info') ?></legend>
        <div class="control-group">
            <label class="control-label"><?= __('Count of phones') ?></label>
            <div class="controls">
                <label class="text" id="count-phones"></label>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label"><?= __('Imported phones') ?></label>
            <div class="controls">
                <input type="hidden" name="imported-phones"/>
                <label class="text" id="imported-phones"></label>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label"><?= __('Invalid phones') ?></label>
            <div class="controls">
                <label class="text" id="unvalid-phones"></label>
            </div>
        </div>
        <div class="control-group" id="duplicated-phones-group">
            <label class="control-label"><?= __('Duplicated phones') ?></label>
            <div class="controls">
                <label class="text" id="duplicated-phones"></label>
                <button type="button" class="btn" id="show-duplicated-phones"><?= __('Show') ?></button>
                <button type="button" class="btn" id="delete-duplicated-phones"><?= __('Remove all') ?></button>
                <img src="/images/ajax_loader_small.gif" id="duplicates-loader" class="hide"/>
                <div id="duplicate-list" class="hide">
                    <table>
                        <tbody>
                        <tr>
                            <td class="phone"></td>
                            <td class="duplicates">
                                <div>
                                    <span class="info"></span>
                                    <a class="delete-icon del-phone" href="#"></a>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="form-actions">
            <a href="<?= url_for('dialer/lists') ?>" class="btn btn-primary"><?= __('OK') ?></a>
        </div>
    </fieldset>
</form>