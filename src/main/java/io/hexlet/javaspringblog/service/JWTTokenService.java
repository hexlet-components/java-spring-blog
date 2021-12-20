package io.hexlet.javaspringblog.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Clock;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.impl.compression.GzipCompressionCodec;
import java.util.Date;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import static io.jsonwebtoken.SignatureAlgorithm.HS256;
import static io.jsonwebtoken.impl.TextCodec.BASE64;

@Service
public class JWTTokenService implements TokenService, Clock {

    private final String secretKey;
    private final String issuer;
    private final Long expirationSec;
    private final Long clockSkewSec;

    public JWTTokenService(@Value("${jwt.issuer:prj_5}") final String issuer,
                           @Value("${jwt.expiration-sec:86400}") final Long expirationSec,
                           @Value("${jwt.clock-skew-sec:300}") final Long clockSkewSec,
                           @Value("${jwt.secret:secret}")final String secret) {
        this.secretKey = BASE64.encode(secret);
        this.issuer = issuer;
        this.expirationSec = expirationSec;
        this.clockSkewSec = clockSkewSec;
    }

    @Override
    public String expiring(final Map<String, Object> attributes) {
        return Jwts.builder()
                .signWith(HS256, secretKey)
                .compressWith(new GzipCompressionCodec())
                .setClaims(getClaims(attributes, expirationSec))
                .compact();
    }

    @Override
    public Map<String, Object> verify(final String token) {
        return Jwts.parser()
                .requireIssuer(issuer)
                .setClock(this)
                .setAllowedClockSkewSeconds(clockSkewSec)
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }

    @Override
    public Date now() {
        return new Date();
    }

    private Claims getClaims(final Map<String, Object> attributes, final Long expiresInSec) {
        final Claims claims = Jwts.claims();
        claims.setIssuer(issuer);
        claims.setIssuedAt(now());
        claims.putAll(attributes);
        if (expiresInSec > 0) {
            claims.setExpiration(new Date(System.currentTimeMillis() + expiresInSec * 1000));
        }
        return claims;
    }
}
