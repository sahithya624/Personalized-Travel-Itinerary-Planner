"""User service for authentication and user management."""

import logging
from datetime import timedelta
from app.db.database import get_db
from app.schemas import UserRegisterRequest, UserLoginRequest, UserResponse, TokenResponse
from app.utils.auth import hash_password, verify_password, create_access_token
from app.utils.errors import AuthenticationError, ValidationError, NotFoundError

logger = logging.getLogger(__name__)


class UserService:
    """Service for user management."""

    def __init__(self):
        """Initialize user service."""
        self.db = get_db()

    async def register_user(self, request: UserRegisterRequest) -> UserResponse:
        """Register a new user."""
        try:
            client = self.db.get_service_client()


            # Check if user exists
            response = client.table("users").select("*").eq("email", request.email).execute()
            if response.data:
                raise ValidationError("User with this email already exists")

            # Hash password
            hashed_password = hash_password(request.password)

            # Create user
            user_data = {
                "email": request.email,
                "name": request.name,
                "password_hash": hashed_password,
            }

            result = client.table("users").insert(user_data).execute()

            if result.data:
                user = result.data[0]
                
                # Initialize user preferences (gracefully handle if table is missing)
                try:
                    pref_data = {
                        "user_id": user["id"],
                        "theme": "light",
                        "currency": "USD",
                        "settings": {"notifications": True}
                    }
                    client.table("preferences").insert(pref_data).execute()
                    logger.info(f"User preferences initialized: {user['id']}")
                except Exception as pref_error:
                    logger.warning(f"Failed to initialize user preferences: {str(pref_error)}. "
                                 "Make sure the 'preferences' table exists in Supabase.")

                return UserResponse(
                    id=user["id"],
                    email=user["email"],
                    name=user["name"],
                    created_at=user["created_at"],
                )

            raise ValidationError("Failed to create user")

        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            if isinstance(e, ValidationError):
                raise
            raise ValidationError(f"Registration failed: {str(e)}")

    async def login_user(self, request: UserLoginRequest) -> TokenResponse:
        """Authenticate user and return token."""
        try:
            client = self.db.get_service_client()

            # Get user by email
            response = client.table("users").select("*").eq("email", request.email).execute()

            if not response.data:
                raise AuthenticationError("Invalid email or password")

            user = response.data[0]

            # Verify password
            if not verify_password(request.password, user["password_hash"]):
                raise AuthenticationError("Invalid email or password")

            # Ensure preferences exist for this user (gracefully handle if table is missing)
            try:
                pref_check = client.table("preferences").select("id").eq("user_id", user["id"]).execute()
                if not pref_check.data:
                    pref_data = {
                        "user_id": user["id"],
                        "theme": "light",
                        "currency": "USD",
                        "settings": {"notifications": True}
                    }
                    client.table("preferences").insert(pref_data).execute()
                    logger.debug(f"Initialized missing preferences for user: {user['id']}")
            except Exception as pref_error:
                logger.warning(f"Failed to check/initialize preferences on login: {str(pref_error)}")

            # Create token
            access_token = create_access_token(
                data={"sub": user["id"], "email": user["email"]},
                expires_delta=timedelta(hours=24),
            )

            logger.info(f"User logged in: {user['id']}")

            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                user_id=user["id"],
            )

        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            if isinstance(e, AuthenticationError):
                raise
            raise AuthenticationError("Login failed")

    async def get_user(self, user_id: str) -> UserResponse:
        """Get user by ID."""
        try:
            client = self.db.get_service_client()

            response = client.table("users").select("*").eq("id", user_id).execute()

            if not response.data:
                raise NotFoundError("User")

            user = response.data[0]
            
            # Ensure preferences exist (gracefully handle if table is missing)
            try:
                pref_check = client.table("preferences").select("id").eq("user_id", user_id).execute()
                if not pref_check.data:
                    pref_data = {
                        "user_id": user_id,
                        "theme": "light",
                        "currency": "USD",
                        "settings": {"notifications": True}
                    }
                    client.table("preferences").insert(pref_data).execute()
            except Exception as pref_error:
                logger.warning(f"Failed to check/initialize preferences on get_user: {str(pref_error)}")

            return UserResponse(
                id=user["id"],
                email=user["email"],
                name=user["name"],
                created_at=user["created_at"],
            )

        except Exception as e:
            logger.error(f"Get user error: {str(e)}")
            if isinstance(e, NotFoundError):
                raise
            raise NotFoundError("User")


def get_user_service() -> UserService:
    """Get user service instance."""
    return UserService()
