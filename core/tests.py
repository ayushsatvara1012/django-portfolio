from django.test import TestCase
from django.urls import reverse
from .models import Example

class SimpleTest(TestCase):
    def test_home_status(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)


class ExampleTests(TestCase):
    def test_create_and_view_example(self):
        # create via ORM
        ex = Example.objects.create(name='Test 1')
        resp = self.client.get(reverse('example_detail', args=[ex.pk]))
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, 'Test 1')

    def test_create_via_form(self):
        resp = self.client.post(reverse('example_create'), {'name': 'Form item'})
        # should redirect to detail
        self.assertEqual(resp.status_code, 302)
        ex = Example.objects.get(name='Form item')
        self.assertIsNotNone(ex)
