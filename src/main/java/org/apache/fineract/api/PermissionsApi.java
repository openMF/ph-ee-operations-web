/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.apache.fineract.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.apache.fineract.organisation.permission.Permission;
import org.apache.fineract.organisation.permission.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.util.List;


@RestController
@SecurityRequirement(name = "auth")
@RequestMapping("/api/v1")
public class PermissionsApi {

    @Autowired
    private PermissionRepository permissionRepository;

    @GetMapping(path = "/permissions", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Permission> retrieveAll() {
        return this.permissionRepository.findAll();
    }

    @GetMapping(path = "/permission/{permissionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Permission retrieveOne(@PathVariable("permissionId") Long permissionId, HttpServletResponse response) {
        Permission permission = permissionRepository.findById(permissionId).get();
        if(permission != null) {
            return permission;
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
    }

    @PostMapping(path = "/permission", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void create(@RequestBody Permission permission, HttpServletResponse response) {
        Permission existing = permissionRepository.findOneByCode(permission.getCode());
        if (existing == null) {
            permission.setId(null);
            permissionRepository.saveAndFlush(permission);
        } else {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
        }
    }

    @PutMapping(path = "/permission/{permissionId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void update(@PathVariable("permissionId") Long permissionId, @RequestBody Permission permission, HttpServletResponse response) {
        Permission existing = permissionRepository.findById(permissionId).get();
        if (existing != null) {
            permission.setId(permissionId);
            permission.setRoles(existing.getRoles());
            permissionRepository.saveAndFlush(permission);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @DeleteMapping(path = "/permission/{permissionId}")
    public void delete(@PathVariable("permissionId") Long permissionId, HttpServletResponse response) {
        if(permissionRepository.existsById(permissionId)) {
            permissionRepository.deleteById(permissionId);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
