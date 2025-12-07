import { TestBed } from '@angular/core/testing';
import { CmsFormset } from '@app/services/models/cms/forms/cms-formset';

const valueForm = {
  label: 'label',
  help_text: 'test',
  value: 'test',
  checked: false,
  placeholder: '',
  input_label: 'input_label',
  input_help_text: '',
  input_default_value: '',
  input_placeholder: '',
};

describe('CmsFormset', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CmsFormset],
    });
  });

  it('should create for singlelinetextinput', () => {
    const form = {
      title: 'title',
      name: 'name',
      description: '',
      required: false,
      default_value: '',
      fields: [{ id: '1', type: 'singlelinetextinput', value: valueForm }],
    };
    const formObject = new CmsFormset(form);
    expect(formObject.title).toBe('title');
    expect(formObject.name).toBe('name');
    expect(formObject.description).toBeNull();
    expect(formObject.required).toBe(false);
    expect(formObject.default).toBe('');
    expect(formObject.fields).toStrictEqual([{ id: '1', type: 'singlelinetextinput', value: valueForm }]);
    expect(formObject.answerOptions).not.toBeNull();
  });

  it('should create for multilinetextinput', () => {
    const form = {
      title: 'title',
      name: 'name',
      description: '',
      required: false,
      default_value: '',
      fields: [{ id: '1', type: 'multilinetextinput', value: valueForm }],
    };
    const formObject = new CmsFormset(form);
    expect(formObject.title).toBe('title');
    expect(formObject.name).toBe('name');
    expect(formObject.description).toBeNull();
    expect(formObject.required).toBe(false);
    expect(formObject.default).toBe('');
    expect(formObject.fields).toStrictEqual([{ id: '1', type: 'multilinetextinput', value: valueForm }]);
    expect(formObject.answerOptions).not.toBeNull();
  });

  it('should create for radiobutton', () => {
    const form = {
      title: 'title',
      name: 'name',
      description: '',
      required: false,
      default_value: '',
      fields: [{ id: '1', type: 'radiobutton', value: valueForm }],
    };
    const formObject = new CmsFormset(form);
    expect(formObject.title).toBe('title');
    expect(formObject.name).toBe('name');
    expect(formObject.description).toBeNull();
    expect(formObject.required).toBe(false);
    expect(formObject.default).toBe('');
    expect(formObject.fields).toStrictEqual([{ id: '1', type: 'radiobutton', value: valueForm }]);
    expect(formObject.answerOptions).not.toBeNull();
  });

  it('should create for radiobuttonwithinput', () => {
    const form = {
      title: 'title',
      name: 'name',
      description: '',
      required: false,
      default_value: '',
      fields: [{ id: '1', type: 'radiobuttonwithinput', value: valueForm }],
    };
    const formObject = new CmsFormset(form);
    expect(formObject.title).toBe('title');
    expect(formObject.name).toBe('name');
    expect(formObject.description).toBeNull();
    expect(formObject.required).toBe(false);
    expect(formObject.default).toBe('');
    expect(formObject.fields).toStrictEqual([{ id: '1', type: 'radiobuttonwithinput', value: valueForm }]);
    expect(formObject.answerOptions).not.toBeNull();
  });

  it('should create for radiobuttonwithmultilineinput', () => {
    const form = {
      title: 'title',
      name: 'name',
      description: '',
      required: false,
      default_value: '',
      fields: [{ id: '1', type: 'radiobuttonwithmultilineinput', value: valueForm }],
    };
    const formObject = new CmsFormset(form);
    expect(formObject.title).toBe('title');
    expect(formObject.name).toBe('name');
    expect(formObject.description).toBeNull();
    expect(formObject.required).toBe(false);
    expect(formObject.default).toBe('');
    expect(formObject.fields).toStrictEqual([{ id: '1', type: 'radiobuttonwithmultilineinput', value: valueForm }]);
    expect(formObject.answerOptions).not.toBeNull();
  });

  it('should create for checkbox', () => {
    const form = {
      title: 'title',
      name: 'name',
      description: '',
      required: false,
      default_value: '',
      fields: [{ id: '1', type: 'checkbox', value: valueForm }],
    };
    const formObject = new CmsFormset(form);
    expect(formObject.title).toBe('title');
    expect(formObject.name).toBe('name');
    expect(formObject.description).toBeNull();
    expect(formObject.required).toBe(false);
    expect(formObject.default).toBe('');
    expect(formObject.fields).toStrictEqual([{ id: '1', type: 'checkbox', value: valueForm }]);
    expect(formObject.answerOptions).not.toBeNull();
  });

  it('should create for checkboxwithinput', () => {
    const form = {
      title: 'title',
      name: 'name',
      description: '',
      required: false,
      default_value: '',
      fields: [{ id: '1', type: 'checkboxwithinput', value: valueForm }],
    };
    const formObject = new CmsFormset(form);
    expect(formObject.title).toBe('title');
    expect(formObject.name).toBe('name');
    expect(formObject.description).toBeNull();
    expect(formObject.required).toBe(false);
    expect(formObject.default).toBe('');
    expect(formObject.fields).toStrictEqual([{ id: '1', type: 'checkboxwithinput', value: valueForm }]);
    expect(formObject.answerOptions).not.toBeNull();
  });

  it('should create for checkboxwithmultilineinput', () => {
    const form = {
      title: 'title',
      name: 'name',
      description: '',
      required: false,
      default_value: '',
      fields: [{ id: '1', type: 'checkboxwithmultilineinput', value: valueForm }],
    };
    const formObject = new CmsFormset(form);
    expect(formObject.title).toBe('title');
    expect(formObject.name).toBe('name');
    expect(formObject.description).toBeNull();
    expect(formObject.required).toBe(false);
    expect(formObject.default).toBe('');
    expect(formObject.fields).toStrictEqual([{ id: '1', type: 'checkboxwithmultilineinput', value: valueForm }]);
    expect(formObject.answerOptions).not.toBeNull();
  });
  it('should create for default', () => {
    const form = {
      title: 'title',
      name: 'name',
      description: '',
      required: false,
      default_value: '',
      fields: [{ id: '1', type: 'type', value: valueForm }],
    };
    const formObject = new CmsFormset(form);
    expect(formObject.title).toBe('title');
    expect(formObject.name).toBe('name');
    expect(formObject.description).toBeNull();
    expect(formObject.required).toBe(false);
    expect(formObject.default).toBe('');
    expect(formObject.fields).toStrictEqual([{ id: '1', type: 'type', value: valueForm }]);
    expect(formObject.answerOptions).toStrictEqual([null]);
  });
});
