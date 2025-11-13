package com.realreview.util;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Base64;

public class SecretKeyGenerator {

    public static void main(String[] args) {
        byte[] key = Keys.secretKeyFor(SignatureAlgorithm.HS512).getEncoded();
        System.out.println("Generated Secure Key:");
        System.out.println(Base64.getEncoder().encodeToString(key));
    }
}
