from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import User


class AuthFlowTests(APITestCase):
    def test_register_and_fetch_profile(self):
        register_response = self.client.post(
            reverse('register'),
            {
                'username': 'demo_user',
                'email': 'demo@example.com',
                'password': 'StrongPassword123',
                'first_name': 'Demo',
                'last_name': 'User',
            },
            format='json',
        )
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        login_response = self.client.post(
            reverse('login'),
            {'username': 'demo_user', 'password': 'StrongPassword123'},
            format='json',
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")

        profile_response = self.client.get(reverse('profile'))
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data['username'], 'demo_user')

    def test_profile_requires_authentication(self):
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
