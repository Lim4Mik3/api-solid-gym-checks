import { FastifyReply, FastifyRequest } from 'fastify';
import { describe, expect, it, vi } from 'vitest';
import { verifyJwt } from './verify-jwt';

describe('Middleware Auth JWT', () => {
  it('should be able validate a JWT token correctly', async () => {
    const jwtVerifyMock = vi.fn();

    const appRequest = {
      jwtVerify: jwtVerifyMock,
    } as unknown;

    const reply: unknown = {};

    jwtVerifyMock.mockImplementation(() => {});

    const response = await verifyJwt(
      appRequest as FastifyRequest,
      reply as FastifyReply
    );

    expect(jwtVerifyMock).toHaveBeenCalledOnce();
    expect(response).toBe(undefined);
  });

  it.skip('should not be able validate a invalid or missing JWT token', async () => {
    const jwtVerifyMock = vi.fn();
    const responseMock = {
      status: vi.fn(),
      send: vi.fn(),
    };

    const appRequest = {
      jwtVerify: jwtVerifyMock,
    } as unknown;

    jwtVerifyMock.mockImplementation(() => {
      throw new Error();
    });

    await verifyJwt(
      appRequest as FastifyRequest,
      responseMock as unknown as FastifyReply
    );

    expect(responseMock.status).toHaveBeenCalledWith(401);
    expect(responseMock.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
});
