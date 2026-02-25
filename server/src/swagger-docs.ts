/**
 * OpenAPI docs – swagger-jsdoc reads these and builds the spec.
 * One block per endpoint; keep it short.
 */

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: Sign up
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               name: { type: string }
 *     responses:
 *       201: { description: Created, content: { application/json: { schema: { type: object, properties: { user: {}, token: { type: string } } } } } }
 *       400: { description: Validation / email exists }
 */
void 0; // so this file has at least one statement

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: OK, content: { application/json: { schema: { type: object, properties: { user: {}, token: { type: string } } } } } }
 *       401: { description: Invalid credentials }
 */
void 0;

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token (sends refresh token via HttpOnly cookie)
 *     tags: [Auth]
 *     responses:
 *       200: { description: OK, content: { application/json: { schema: { type: object, properties: { user: {}, token: { type: string } } } } } }
 *       401: { description: Invalid or expired refresh token }
 */
void 0;

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Log out (invalidates refresh token, clears cookie)
 *     tags: [Auth]
 *     responses:
 *       204: { description: No content }
 */
void 0;

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: List events (paginated)
 *     tags: [Events]
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer, default: 1 } }
 *       - { name: limit, in: query, schema: { type: integer, default: 10 } }
 *       - { name: filter, in: query, schema: { type: string, enum: [upcoming, past] } }
 *       - { name: tag, in: query, schema: { type: string } }
 *       - { name: event_type, in: query, schema: { type: string, enum: [public, private] } }
 *     responses:
 *       200: { description: OK, content: { application/json: { schema: { type: object, properties: { events: { type: array }, pagination: {} } } } } }
 */
void 0;

/**
 * @openapi
 * /api/events:
 *   post:
 *     summary: Create event
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, event_date]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               event_date: { type: string, format: date-time }
 *               location: { type: string }
 *               event_type: { type: string, enum: [public, private] }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Created }
 *       401: { description: Unauthorized }
 */
void 0;

/**
 * @openapi
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters: [{ name: id, in: path, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
void 0;

/**
 * @openapi
 * /api/events/{id}:
 *   patch:
 *     summary: Update event (creator only)
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: id, in: path, required: true, schema: { type: integer } }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               event_date: { type: string, format: date-time }
 *               location: { type: string }
 *               event_type: { type: string, enum: [public, private] }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden (not creator) }
 *       404: { description: Not found }
 */
void 0;

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     summary: Delete event (creator only)
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ name: id, in: path, required: true, schema: { type: integer } }]
 *     responses:
 *       204: { description: No content }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 */
void 0;

/**
 * @openapi
 * /api/tags:
 *   get:
 *     summary: List all tags
 *     tags: [Tags]
 *     responses:
 *       200: { description: OK, content: { application/json: { schema: { type: object, properties: { tags: { type: array } } } } } }
 */
void 0;
