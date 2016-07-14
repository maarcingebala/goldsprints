from django import forms
from django.forms import BoundField, BaseForm
from django.forms.utils import ErrorList
from django.template import Library, TemplateSyntaxError
from django.template.loader import render_to_string

register = Library()


TEMPLATE_ERRORS = 'bulma/_non_field_errors.html'
TEMPLATE_FIELD = 'bulma/_field.html'
TEMPLATE_FORM = 'bulma/_form.html'


def render_non_field_errors(errors):
    if not errors:
        return ''
    context = {'errors': errors}
    return render_to_string(TEMPLATE_ERRORS, context=context)


@register.simple_tag
def render_field(bound_field, **kwargs):
    widget = bound_field.field.widget

    if isinstance(widget, forms.RadioSelect):
        input_type = 'radio'
    elif isinstance(widget, forms.Textarea):
        input_type = 'textarea'
    elif isinstance(widget, forms.CheckboxInput):
        input_type = 'checkbox'
    elif isinstance(widget, forms.CheckboxSelectMultiple):
        input_type = 'checkbox'
    elif issubclass(type(widget), forms.MultiWidget):
        input_type = 'multi_widget'
    elif isinstance(widget, forms.Select):
        input_type = 'select'
    else:
        input_type = widget.input_type

    context = {
        'bound_field': bound_field,
        'input_type': input_type,
        'label': bound_field.label,
        'help_text': bound_field.help_text,
        'show_label': kwargs.get('show_label', False),
        'columns': '',
        'parent': 'div',
        'placeholder': bound_field.field.widget.attrs.get('placeholder'),
        'class': 'input',
        'show_optional_in_label': kwargs.get('show_optional_in_label', True),
        'errors': bound_field.errors,
        'choices': list(bound_field.field.choices) if hasattr(bound_field.field, 'choices') else []}
    context.update(kwargs)
    return render_to_string(TEMPLATE_FIELD, context=context)


@register.simple_tag
def bulma(obj, **kwargs):
    if isinstance(obj, BoundField):
        return render_field(obj, **kwargs)
    elif isinstance(obj, ErrorList):
        return render_non_field_errors(obj)
    elif isinstance(obj, BaseForm):
        non_field_errors = render_non_field_errors(obj.non_field_errors())
        rendered_fields = [render_field(field, **kwargs) for field in obj]
        context = {
            'non_field_errors': non_field_errors,
            'rendered_fields': rendered_fields,
            'submit': kwargs.get('submit'),
            'submit_class': kwargs.get('submit_class'),
            'columns': kwargs.get('columns')
        }
        return render_to_string(TEMPLATE_FORM, context=context)
    else:
        raise TemplateSyntaxError('Filter accepts form, field and non fields '
                                  'errors.')


@register.simple_tag(takes_context=True)
def render_widget(context, obj, **attrs):
    widget = obj.field.widget
    input_type = getattr(widget, 'input_type', None)
    widget_attr_keys = context.get('widget_attrs', 'placeholder')
    widget_attr_keys = [attr.strip() for attr in widget_attr_keys.split(',')]
    # add proper context variables
    for attr in context.flatten().keys():
        if attr.startswith('data_') or attr in widget_attr_keys:
            attrs.setdefault(attr, context[attr])

    attrs = {name.replace('_', '-'): attr for name, attr in attrs.items()}
    widget_attrs = widget.attrs.copy()
    widget_attrs.update(attrs)
    attrs = widget_attrs

    if 'input_class' in context:
        attrs['class'] = context['input_class']
    if obj.field.required:
        attrs['required'] = 'required'

    if input_type not in [None, 'text', 'number']:
        attrs['autocapitalize'] = 'off'
        attrs['autocorrect'] = 'off'
    elif 'autocomplete' in ' '.join(attrs.keys()):
        attrs['autocorrect'] = 'off'

    if input_type == 'email' and 'autocomplete' not in attrs:
        attrs['autocomplete'] = 'email'
    if input_type == 'tel' and 'autocomplete' not in attrs:
        attrs['autocomplete'] = 'tel'
    # fix for safari mobile for keyboard
    if input_type == 'number':
        attrs['pattern'] = '\d*'
    return obj.as_widget(attrs=attrs)
