import { UserRole } from "@prisma/client";

import { NIGERIAN_STATES } from "../utils/nigerian-states";

const userRoleValues = Object.values(UserRole);
const nigerianStates = [...NIGERIAN_STATES];

const schemaRef = (name: string) => ({
  $ref: `#/components/schemas/${name}`,
});

const jsonContent = (
  schema: Record<string, unknown>,
  example?: Record<string, unknown>,
) => ({
  "application/json": example ? { schema, example } : { schema },
});

const successResponse = (
  description: string,
  schemaName: string,
  example?: Record<string, unknown>,
) => ({
  description,
  content: jsonContent(schemaRef(schemaName), example),
});

const errorResponse = (
  description: string,
  message: string,
  errors: unknown[] = [],
) => ({
  description,
  content: jsonContent(schemaRef("ErrorResponse"), {
    success: false,
    message,
    errors,
  }),
});

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "market-place Backend API",
    version: "1.0.0",
    description:
      "REST API for authentication, producer profile management, marketplace discovery, and metadata endpoints.",
  },
  servers: [
    {
      url: "/",
      description: "Current server",
    },
  ],
  tags: [
    {
      name: "System",
      description: "Service status and root information endpoints.",
    },
    { name: "Metadata", description: "Static metadata used by clients." },
    { name: "Auth", description: "Authentication and current user endpoints." },
    {
      name: "Producers",
      description: "Producer profile management endpoints.",
    },
    {
      name: "Marketplace",
      description: "Public marketplace search endpoints.",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Paste a valid access token in the format: Bearer <token>.",
      },
    },
    schemas: {
      ValidationIssue: {
        type: "object",
        required: ["path", "message"],
        properties: {
          path: {
            type: "string",
            example: "email",
          },
          message: {
            type: "string",
            example: "A valid email address is required",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["success", "message", "errors"],
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Validation failed",
          },
          errors: {
            type: "array",
            items: {
              oneOf: [
                schemaRef("ValidationIssue"),
                {
                  type: "object",
                  additionalProperties: true,
                },
                {
                  type: "string",
                },
              ],
            },
            example: [
              {
                path: "email",
                message: "A valid email address is required",
              },
            ],
          },
        },
      },
      ServiceInfoData: {
        type: "object",
        required: ["service", "version"],
        properties: {
          service: {
            type: "string",
            example: "market-place-backend",
          },
          version: {
            type: "string",
            example: "1.0.0",
          },
        },
      },
      HealthData: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            example: "ok",
          },
        },
      },
      NigerianStatesData: {
        type: "object",
        required: ["states"],
        properties: {
          states: {
            type: "array",
            items: {
              type: "string",
              enum: nigerianStates,
            },
            example: ["Lagos", "Federal Capital Territory", "Kano"],
          },
        },
      },
      OwnerSummary: {
        type: "object",
        required: ["id", "fullName"],
        properties: {
          id: {
            type: "string",
            example: "clxw4k4t0000008l1c9mva2pw",
          },
          fullName: {
            type: "string",
            example: "Bola Akin",
          },
        },
      },
      EmbeddedProducerProfile: {
        type: "object",
        required: [
          "id",
          "businessName",
          "description",
          "locationState",
          "locationCity",
          "address",
          "fabricTypes",
          "priceRangeMin",
          "priceRangeMax",
          "minimumOrderQuantity",
          "deliveryAvailable",
          "whatsappNumber",
          "profileImageUrl",
          "isVerified",
          "ratingAverage",
          "ratingCount",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: {
            type: "string",
            example: "clxw4kc4h000108l10jf0i5da",
          },
          businessName: {
            type: "string",
            example: "Bola Fabrics",
          },
          description: {
            type: "string",
            example: "Wholesale Ankara and lace supplier",
          },
          locationState: {
            type: "string",
            enum: nigerianStates,
            example: "Lagos",
          },
          locationCity: {
            type: "string",
            example: "Yaba",
          },
          address: {
            type: "string",
            example: "12 Commercial Avenue, Yaba, Lagos",
          },
          fabricTypes: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["Ankara", "Lace"],
          },
          priceRangeMin: {
            type: "number",
            nullable: true,
            example: 5000,
          },
          priceRangeMax: {
            type: "number",
            nullable: true,
            example: 20000,
          },
          minimumOrderQuantity: {
            type: "integer",
            example: 10,
          },
          deliveryAvailable: {
            type: "boolean",
            example: true,
          },
          whatsappNumber: {
            type: "string",
            example: "+2348012345678",
          },
          profileImageUrl: {
            type: "string",
            format: "uri",
            nullable: true,
            example: "https://example.com/storefront.jpg",
          },
          isVerified: {
            type: "boolean",
            example: true,
          },
          ratingAverage: {
            type: "number",
            format: "float",
            example: 4.8,
          },
          ratingCount: {
            type: "integer",
            example: 23,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-25T10:15:30.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-25T10:15:30.000Z",
          },
        },
      },
      ProducerProfile: {
        allOf: [
          schemaRef("EmbeddedProducerProfile"),
          {
            type: "object",
            required: ["owner"],
            properties: {
              owner: schemaRef("OwnerSummary"),
            },
          },
        ],
      },
      User: {
        type: "object",
        required: [
          "id",
          "fullName",
          "email",
          "phoneNumber",
          "role",
          "createdAt",
          "updatedAt",
          "producerProfile",
        ],
        properties: {
          id: {
            type: "string",
            example: "clxw4k4t0000008l1c9mva2pw",
          },
          fullName: {
            type: "string",
            example: "Bola Akin",
          },
          email: {
            type: "string",
            format: "email",
            example: "bola@example.com",
          },
          phoneNumber: {
            type: "string",
            example: "+2348012345678",
          },
          role: {
            type: "string",
            enum: userRoleValues,
            example: UserRole.PRODUCER,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-25T10:15:30.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-25T10:15:30.000Z",
          },
          producerProfile: {
            allOf: [schemaRef("EmbeddedProducerProfile")],
            nullable: true,
          },
        },
      },
      AuthData: {
        type: "object",
        required: ["token", "user"],
        properties: {
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          user: schemaRef("User"),
        },
      },
      CurrentUserData: {
        type: "object",
        required: ["user"],
        properties: {
          user: schemaRef("User"),
        },
      },
      ProducerProfileData: {
        type: "object",
        required: ["profile"],
        properties: {
          profile: schemaRef("ProducerProfile"),
        },
      },
      Pagination: {
        type: "object",
        required: [
          "page",
          "limit",
          "total",
          "totalPages",
          "hasNextPage",
          "hasPreviousPage",
        ],
        properties: {
          page: {
            type: "integer",
            example: 1,
          },
          limit: {
            type: "integer",
            example: 20,
          },
          total: {
            type: "integer",
            example: 42,
          },
          totalPages: {
            type: "integer",
            example: 3,
          },
          hasNextPage: {
            type: "boolean",
            example: true,
          },
          hasPreviousPage: {
            type: "boolean",
            example: false,
          },
        },
      },
      MarketplaceResultsData: {
        type: "object",
        required: ["items", "pagination"],
        properties: {
          items: {
            type: "array",
            items: schemaRef("ProducerProfile"),
          },
          pagination: schemaRef("Pagination"),
        },
      },
      ServiceInfoResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "market-place backend is running",
          },
          data: schemaRef("ServiceInfoData"),
        },
      },
      HealthResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Service is healthy",
          },
          data: schemaRef("HealthData"),
        },
      },
      NigerianStatesResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Nigerian states fetched successfully",
          },
          data: schemaRef("NigerianStatesData"),
        },
      },
      AuthResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Login successful",
          },
          data: schemaRef("AuthData"),
        },
      },
      CurrentUserResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Current user fetched successfully",
          },
          data: schemaRef("CurrentUserData"),
        },
      },
      ProducerProfileResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Producer profile fetched successfully",
          },
          data: schemaRef("ProducerProfileData"),
        },
      },
      MarketplaceResultsResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Marketplace producers fetched successfully",
          },
          data: schemaRef("MarketplaceResultsData"),
        },
      },
      DesignerRegisterRequest: {
        type: "object",
        additionalProperties: false,
        required: ["fullName", "email", "password", "phoneNumber", "role"],
        properties: {
          fullName: {
            type: "string",
            minLength: 2,
            maxLength: 120,
            example: "Adaeze Okeke",
          },
          email: {
            type: "string",
            format: "email",
            example: "adaeze@example.com",
          },
          password: {
            type: "string",
            minLength: 8,
            maxLength: 72,
            example: "Password123",
          },
          phoneNumber: {
            type: "string",
            minLength: 10,
            maxLength: 20,
            example: "+2348012345678",
          },
          role: {
            type: "string",
            enum: [UserRole.DESIGNER],
            example: UserRole.DESIGNER,
          },
        },
      },
      ProducerRegisterRequest: {
        type: "object",
        additionalProperties: false,
        required: [
          "fullName",
          "email",
          "password",
          "phoneNumber",
          "role",
          "businessName",
          "description",
          "locationState",
          "locationCity",
          "address",
          "fabricTypes",
          "minimumOrderQuantity",
          "deliveryAvailable",
          "whatsappNumber",
        ],
        properties: {
          fullName: {
            type: "string",
            minLength: 2,
            maxLength: 120,
            example: "Bola Akin",
          },
          email: {
            type: "string",
            format: "email",
            example: "bola@example.com",
          },
          password: {
            type: "string",
            minLength: 8,
            maxLength: 72,
            example: "Password123",
          },
          phoneNumber: {
            type: "string",
            minLength: 10,
            maxLength: 20,
            example: "+2348012345678",
          },
          role: {
            type: "string",
            enum: [UserRole.PRODUCER],
            example: UserRole.PRODUCER,
          },
          businessName: {
            type: "string",
            minLength: 2,
            maxLength: 120,
            example: "Bola Fabrics",
          },
          description: {
            type: "string",
            minLength: 10,
            maxLength: 1000,
            example: "Wholesale Ankara and lace supplier",
          },
          locationState: {
            type: "string",
            enum: nigerianStates,
            example: "Lagos",
          },
          locationCity: {
            type: "string",
            minLength: 2,
            maxLength: 120,
            example: "Yaba",
          },
          address: {
            type: "string",
            minLength: 5,
            maxLength: 255,
            example: "12 Commercial Avenue, Yaba, Lagos",
          },
          fabricTypes: {
            type: "array",
            minItems: 1,
            items: {
              type: "string",
              minLength: 2,
              maxLength: 80,
            },
            example: ["Ankara", "Lace"],
          },
          minimumOrderQuantity: {
            type: "integer",
            minimum: 1,
            example: 10,
          },
          deliveryAvailable: {
            type: "boolean",
            example: true,
          },
          whatsappNumber: {
            type: "string",
            minLength: 10,
            maxLength: 20,
            example: "+2348012345678",
          },
        },
      },
      LoginRequest: {
        type: "object",
        additionalProperties: false,
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "bola@example.com",
          },
          password: {
            type: "string",
            minLength: 1,
            maxLength: 72,
            example: "Password123",
          },
        },
      },
      UpdateProducerProfileRequest: {
        type: "object",
        additionalProperties: false,
        minProperties: 1,
        properties: {
          businessName: {
            type: "string",
            minLength: 2,
            maxLength: 120,
          },
          description: {
            type: "string",
            minLength: 10,
            maxLength: 1000,
          },
          locationState: {
            type: "string",
            enum: nigerianStates,
          },
          locationCity: {
            type: "string",
            minLength: 2,
            maxLength: 120,
          },
          address: {
            type: "string",
            minLength: 5,
            maxLength: 255,
          },
          fabricTypes: {
            type: "array",
            minItems: 1,
            items: {
              type: "string",
              minLength: 2,
              maxLength: 80,
            },
          },
          priceRangeMin: {
            type: "number",
            minimum: 0,
            nullable: true,
          },
          priceRangeMax: {
            type: "number",
            minimum: 0,
            nullable: true,
          },
          minimumOrderQuantity: {
            type: "integer",
            minimum: 1,
          },
          deliveryAvailable: {
            type: "boolean",
          },
          whatsappNumber: {
            type: "string",
            minLength: 10,
            maxLength: 20,
          },
          profileImageUrl: {
            type: "string",
            format: "uri",
            nullable: true,
          },
        },
        example: {
          description: "Premium bridal lace and ready-to-wear fabric supplier",
          priceRangeMin: 5000,
          priceRangeMax: 20000,
          deliveryAvailable: true,
          profileImageUrl: "https://example.com/storefront.jpg",
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["System"],
        summary: "Get API service information",
        operationId: "getServiceInfo",
        responses: {
          "200": successResponse(
            "Service information fetched successfully",
            "ServiceInfoResponse",
            {
              success: true,
              message: "market-place backend is running",
              data: {
                service: "market-place-backend",
                version: "1.0.0",
              },
            },
          ),
        },
      },
    },
    "/health": {
      get: {
        tags: ["System"],
        summary: "Get service health",
        operationId: "getHealth",
        responses: {
          "200": successResponse(
            "Health status fetched successfully",
            "HealthResponse",
            {
              success: true,
              message: "Service is healthy",
              data: {
                status: "ok",
              },
            },
          ),
        },
      },
    },
    "/metadata/nigerian-states": {
      get: {
        tags: ["Metadata"],
        summary: "List supported Nigerian states",
        operationId: "getNigerianStates",
        responses: {
          "200": successResponse(
            "Supported Nigerian states fetched successfully",
            "NigerianStatesResponse",
            {
              success: true,
              message: "Nigerian states fetched successfully",
              data: {
                states: ["Lagos", "Federal Capital Territory", "Kano"],
              },
            },
          ),
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a designer or producer account",
        operationId: "registerUser",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  schemaRef("DesignerRegisterRequest"),
                  schemaRef("ProducerRegisterRequest"),
                ],
              },
              examples: {
                designer: {
                  summary: "Designer registration",
                  value: {
                    fullName: "Adaeze Okeke",
                    email: "adaeze@example.com",
                    password: "Password123",
                    phoneNumber: "+2348012345678",
                    role: UserRole.DESIGNER,
                  },
                },
                producer: {
                  summary: "Producer registration",
                  value: {
                    fullName: "Bola Akin",
                    email: "bola@example.com",
                    password: "Password123",
                    phoneNumber: "+2348012345678",
                    role: UserRole.PRODUCER,
                    businessName: "Bola Fabrics",
                    description: "Wholesale Ankara and lace supplier",
                    locationState: "Lagos",
                    locationCity: "Yaba",
                    address: "12 Commercial Avenue, Yaba, Lagos",
                    fabricTypes: ["Ankara", "Lace"],
                    minimumOrderQuantity: 10,
                    deliveryAvailable: true,
                    whatsappNumber: "+2348012345678",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": successResponse(
            "Account created successfully",
            "AuthResponse",
          ),
          "400": errorResponse("Validation failed", "Validation failed", [
            {
              path: "email",
              message: "A valid email address is required",
            },
          ]),
          "409": errorResponse(
            "Conflict",
            "An account with this email already exists",
            [],
          ),
          "500": errorResponse(
            "Unexpected server error",
            "An unexpected error occurred",
            [],
          ),
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in with email and password",
        operationId: "loginUser",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: schemaRef("LoginRequest"),
              example: {
                email: "bola@example.com",
                password: "Password123",
              },
            },
          },
        },
        responses: {
          "200": successResponse("Authentication successful", "AuthResponse"),
          "400": errorResponse("Validation failed", "Validation failed", [
            {
              path: "password",
              message: "Password is required",
            },
          ]),
          "401": errorResponse(
            "Invalid credentials",
            "Invalid email or password",
            [],
          ),
          "500": errorResponse(
            "Unexpected server error",
            "An unexpected error occurred",
            [],
          ),
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the currently authenticated user",
        operationId: "getCurrentUser",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": successResponse(
            "Current user fetched successfully",
            "CurrentUserResponse",
          ),
          "401": errorResponse(
            "Authentication failed",
            "Authentication is required",
            [],
          ),
          "404": errorResponse("User not found", "User account not found", []),
          "500": errorResponse(
            "Unexpected server error",
            "An unexpected error occurred",
            [],
          ),
        },
      },
    },
    "/producers/me": {
      get: {
        tags: ["Producers"],
        summary: "Get the authenticated producer profile",
        operationId: "getMyProducerProfile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": successResponse(
            "Producer profile fetched successfully",
            "ProducerProfileResponse",
          ),
          "401": errorResponse(
            "Authentication failed",
            "Authentication is required",
            [],
          ),
          "403": errorResponse(
            "Forbidden",
            "You do not have permission to access this resource",
            [],
          ),
          "404": errorResponse(
            "Producer profile not found",
            "Producer profile not found",
            [],
          ),
          "500": errorResponse(
            "Unexpected server error",
            "An unexpected error occurred",
            [],
          ),
        },
      },
      put: {
        tags: ["Producers"],
        summary: "Update the authenticated producer profile",
        operationId: "updateMyProducerProfile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: schemaRef("UpdateProducerProfileRequest"),
              example: {
                description:
                  "Premium bridal lace and ready-to-wear fabric supplier",
                priceRangeMin: 5000,
                priceRangeMax: 20000,
                deliveryAvailable: true,
                profileImageUrl: "https://example.com/storefront.jpg",
              },
            },
          },
        },
        responses: {
          "200": successResponse(
            "Producer profile updated successfully",
            "ProducerProfileResponse",
          ),
          "400": errorResponse("Validation failed", "Validation failed", [
            {
              path: "priceRangeMax",
              message:
                "priceRangeMax must be greater than or equal to priceRangeMin",
            },
          ]),
          "401": errorResponse(
            "Authentication failed",
            "Authentication is required",
            [],
          ),
          "403": errorResponse(
            "Forbidden",
            "You do not have permission to access this resource",
            [],
          ),
          "404": errorResponse(
            "Producer profile not found",
            "Producer profile not found",
            [],
          ),
          "500": errorResponse(
            "Unexpected server error",
            "An unexpected error occurred",
            [],
          ),
        },
      },
    },
    "/producers/{id}": {
      get: {
        tags: ["Producers"],
        summary: "Get a producer profile by id",
        operationId: "getProducerById",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
            },
            description: "Producer profile id.",
            example: "clxw4kc4h000108l10jf0i5da",
          },
        ],
        responses: {
          "200": successResponse(
            "Producer profile fetched successfully",
            "ProducerProfileResponse",
          ),
          "404": errorResponse(
            "Producer profile not found",
            "Producer profile not found",
            [],
          ),
          "500": errorResponse(
            "Unexpected server error",
            "An unexpected error occurred",
            [],
          ),
        },
      },
    },
    "/marketplace/producers": {
      get: {
        tags: ["Marketplace"],
        summary: "Search and filter marketplace producers",
        operationId: "searchMarketplaceProducers",
        parameters: [
          {
            in: "query",
            name: "locationState",
            required: false,
            schema: {
              type: "string",
              enum: nigerianStates,
            },
            description: "Filter producers by Nigerian state.",
          },
          {
            in: "query",
            name: "locationCity",
            required: false,
            schema: {
              type: "string",
            },
            description: "Filter producers by city.",
          },
          {
            in: "query",
            name: "fabricType",
            required: false,
            schema: {
              type: "string",
            },
            description: "Filter producers by a matching fabric type.",
          },
          {
            in: "query",
            name: "deliveryAvailable",
            required: false,
            schema: {
              type: "boolean",
            },
            description: "Filter producers that support delivery.",
          },
          {
            in: "query",
            name: "minPrice",
            required: false,
            schema: {
              type: "number",
              minimum: 0,
            },
            description:
              "Filter producers whose price range overlaps the minimum price.",
          },
          {
            in: "query",
            name: "maxPrice",
            required: false,
            schema: {
              type: "number",
              minimum: 0,
            },
            description:
              "Filter producers whose price range overlaps the maximum price.",
          },
          {
            in: "query",
            name: "search",
            required: false,
            schema: {
              type: "string",
            },
            description:
              "Case-insensitive free text search across name, description, city, state, and fabric types.",
          },
          {
            in: "query",
            name: "page",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
            description: "Result page number.",
          },
          {
            in: "query",
            name: "limit",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 20,
            },
            description: "Maximum number of results per page.",
          },
          {
            in: "query",
            name: "sortBy",
            required: false,
            schema: {
              type: "string",
              enum: ["newest", "rating", "businessName"],
              default: "newest",
            },
            description: "Sorting strategy for results.",
          },
        ],
        responses: {
          "200": successResponse(
            "Marketplace producers fetched successfully",
            "MarketplaceResultsResponse",
          ),
          "400": errorResponse("Validation failed", "Validation failed", [
            {
              path: "maxPrice",
              message: "maxPrice must be greater than or equal to minPrice",
            },
          ]),
          "500": errorResponse(
            "Unexpected server error",
            "An unexpected error occurred",
            [],
          ),
        },
      },
    },
  },
} as const;

export const createSwaggerUiHtml = (specUrl: string) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>market-place Backend API Docs</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
      crossorigin="anonymous"
    />
    <style>
      body {
        margin: 0;
        background: #f5f7fb;
      }

      .swagger-ui .topbar {
        background: #101828;
      }

      .swagger-ui .topbar-wrapper img {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script
      src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"
      crossorigin="anonymous"
    ></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '${specUrl}',
          dom_id: '#swagger-ui',
          deepLinking: true,
          displayRequestDuration: true,
          persistAuthorization: true,
          tryItOutEnabled: true,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: 'StandaloneLayout',
        });
      };
    </script>
  </body>
</html>`;
