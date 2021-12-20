package io.hexlet.javaspringblog.config.security;

import java.io.IOException;
import java.util.Optional;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

public class TokenAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    private static final String BEARER = "Bearer";

    public TokenAuthenticationFilter(final RequestMatcher requiresAuth) {
        super(requiresAuth);
    }

    @Override
    public Authentication attemptAuthentication(final HttpServletRequest request,
                                                final HttpServletResponse response) throws AuthenticationException {
        var authenticationToken = Optional.ofNullable(request.getHeader(AUTHORIZATION))
                .map(auth -> auth.replaceFirst("^" + BEARER, ""))
                .map(String::trim)
                .map(token -> new UsernamePasswordAuthenticationToken(token, token))
                .orElseThrow(() -> new BadCredentialsException("No Token Provided"));

        return getAuthenticationManager().authenticate(authenticationToken);
    }

    @Override
    public void successfulAuthentication(final HttpServletRequest request,
                                         final HttpServletResponse response,
                                         final FilterChain chain,
                                         final Authentication authResult) throws ServletException, IOException {
        super.successfulAuthentication(request, response, chain, authResult);
        chain.doFilter(request, response);
    }

}
