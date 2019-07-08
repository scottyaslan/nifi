/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.nifi.integration.parameters;

import org.apache.nifi.connectable.Connection;
import org.apache.nifi.controller.ProcessorNode;
import org.apache.nifi.controller.queue.FlowFileQueue;
import org.apache.nifi.controller.repository.FlowFileRecord;
import org.apache.nifi.integration.FrameworkIntegrationTest;
import org.apache.nifi.integration.processors.GenerateProcessor;
import org.apache.nifi.integration.processors.UpdateAttributeCreateOwnProperty;
import org.apache.nifi.integration.processors.UpdateAttributeNoEL;
import org.apache.nifi.integration.processors.UpdateAttributeWithEL;
import org.apache.nifi.parameter.Parameter;
import org.apache.nifi.parameter.ParameterContext;
import org.apache.nifi.parameter.ParameterDescriptor;
import org.apache.nifi.parameter.ParameterReferenceManager;
import org.apache.nifi.parameter.StandardParameterContext;
import org.apache.nifi.parameter.StandardParameterReferenceManager;
import org.junit.Test;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import static org.junit.Assert.assertEquals;

public class ParametersIT extends FrameworkIntegrationTest {

    @Test
    public void testSimpleParameterSubstitution() throws ExecutionException, InterruptedException {
        final ProcessorNode generate = createProcessorNode(GenerateProcessor.class);
        final ProcessorNode updateAttribute = createProcessorNode(UpdateAttributeNoEL.class);
        final ProcessorNode terminate = getTerminateProcessor();

        final Connection generatedFlowFileConnection = connect(generate, updateAttribute, REL_SUCCESS);
        final Connection updatedAttributeConnection = connect(updateAttribute, terminate, REL_SUCCESS);

        final ParameterReferenceManager referenceManager = new StandardParameterReferenceManager(getFlowController().getFlowManager());
        final ParameterContext parameterContext = new StandardParameterContext(UUID.randomUUID().toString(), "param-context", referenceManager);
        parameterContext.setParameters(Collections.singleton(new Parameter(new ParameterDescriptor.Builder().name("test").build(), "unit")));

        getRootGroup().setParameterContext(parameterContext);
        updateAttribute.setProperties(Collections.singletonMap("test", "#{test}"));

        triggerOnce(generate);
        triggerOnce(updateAttribute);

        final FlowFileQueue flowFileQueue = updatedAttributeConnection.getFlowFileQueue();
        final FlowFileRecord flowFileRecord = flowFileQueue.poll(Collections.emptySet());

        assertEquals("unit", flowFileRecord.getAttribute("test"));
    }

    @Test
    public void testParameterSubstitutionWithinELWhenELNotSupported() throws ExecutionException, InterruptedException {
        final ProcessorNode generate = createProcessorNode(GenerateProcessor.class);
        final ProcessorNode updateAttribute = createProcessorNode(UpdateAttributeNoEL.class);
        final ProcessorNode terminate = getTerminateProcessor();

        final Connection generatedFlowFileConnection = connect(generate, updateAttribute, REL_SUCCESS);
        final Connection updatedAttributeConnection = connect(updateAttribute, terminate, REL_SUCCESS);

        final ParameterReferenceManager referenceManager = new StandardParameterReferenceManager(getFlowController().getFlowManager());
        final ParameterContext parameterContext = new StandardParameterContext(UUID.randomUUID().toString(), "param-context", referenceManager);
        parameterContext.setParameters(Collections.singleton(new Parameter(new ParameterDescriptor.Builder().name("test").build(), "unit")));

        getRootGroup().setParameterContext(parameterContext);
        updateAttribute.setProperties(Collections.singletonMap("test", "${#{test}:toUpper()}"));

        triggerOnce(generate);
        triggerOnce(updateAttribute);

        final FlowFileQueue flowFileQueue = updatedAttributeConnection.getFlowFileQueue();
        final FlowFileRecord flowFileRecord = flowFileQueue.poll(Collections.emptySet());

        assertEquals("${unit:toUpper()}", flowFileRecord.getAttribute("test"));
    }

    @Test
    public void testParameterSubstitutionWithinELWhenELIsSupported() throws ExecutionException, InterruptedException {
        final ProcessorNode generate = createProcessorNode(GenerateProcessor.class);
        final ProcessorNode updateAttribute = createProcessorNode(UpdateAttributeWithEL.class);
        final ProcessorNode terminate = getTerminateProcessor();

        final Connection generatedFlowFileConnection = connect(generate, updateAttribute, REL_SUCCESS);
        final Connection updatedAttributeConnection = connect(updateAttribute, terminate, REL_SUCCESS);

        final ParameterReferenceManager referenceManager = new StandardParameterReferenceManager(getFlowController().getFlowManager());
        final ParameterContext parameterContext = new StandardParameterContext(UUID.randomUUID().toString(), "param-context", referenceManager);
        parameterContext.setParameters(Collections.singleton(new Parameter(new ParameterDescriptor.Builder().name("test").build(), "unit")));

        getRootGroup().setParameterContext(parameterContext);
        updateAttribute.setProperties(Collections.singletonMap("test", "${#{test}:toUpper()}"));

        triggerOnce(generate);
        triggerOnce(updateAttribute);

        final FlowFileQueue flowFileQueue = updatedAttributeConnection.getFlowFileQueue();
        final FlowFileRecord flowFileRecord = flowFileQueue.poll(Collections.emptySet());

        assertEquals("UNIT", flowFileRecord.getAttribute("test"));
    }

    @Test
    public void testMixAndMatchELAndParameters() throws ExecutionException, InterruptedException {
        final ProcessorNode generate = createProcessorNode(GenerateProcessor.class);
        final ProcessorNode updateAttribute = createProcessorNode(UpdateAttributeWithEL.class);
        final ProcessorNode terminate = getTerminateProcessor();

        final Connection generatedFlowFileConnection = connect(generate, updateAttribute, REL_SUCCESS);
        final Connection updatedAttributeConnection = connect(updateAttribute, terminate, REL_SUCCESS);

        final ParameterReferenceManager referenceManager = new StandardParameterReferenceManager(getFlowController().getFlowManager());
        final ParameterContext parameterContext = new StandardParameterContext(UUID.randomUUID().toString(), "param-context", referenceManager);
        parameterContext.setParameters(Collections.singleton(new Parameter(new ParameterDescriptor.Builder().name("test").build(), "unit")));

        getRootGroup().setParameterContext(parameterContext);

        final Map<String, String> properties = new HashMap<>();
        properties.put("mixed", "test ${#{test}} #{test} ${#{test}:toUpper()} ${#{test}:equalsIgnoreCase('uNiT')} again ${#{test}}");
        properties.put("ends with text", "test ${#{test}} #{test} ${#{test}:toUpper()} ${#{test}:equalsIgnoreCase('uNiT')} again");
        properties.put("el and param", "#{test} - ${#{test}}");
        updateAttribute.setProperties(properties);

        triggerOnce(generate);
        triggerOnce(updateAttribute);

        final FlowFileQueue flowFileQueue = updatedAttributeConnection.getFlowFileQueue();
        final FlowFileRecord flowFileRecord = flowFileQueue.poll(Collections.emptySet());

        assertEquals("test unit unit UNIT true again unit", flowFileRecord.getAttribute("mixed"));
        assertEquals("test unit unit UNIT true again", flowFileRecord.getAttribute("ends with text"));
        assertEquals("unit - unit", flowFileRecord.getAttribute("el and param"));
    }

    @Test
    public void testParametersInELFromNewPropertyValueAndText() throws ExecutionException, InterruptedException {
        final ProcessorNode generate = createProcessorNode(GenerateProcessor.class);
        final ProcessorNode updateAttribute = createProcessorNode(UpdateAttributeCreateOwnProperty.class);
        final ProcessorNode terminate = getTerminateProcessor();

        final Connection generatedFlowFileConnection = connect(generate, updateAttribute, REL_SUCCESS);
        final Connection updatedAttributeConnection = connect(updateAttribute, terminate, REL_SUCCESS);

        final ParameterReferenceManager referenceManager = new StandardParameterReferenceManager(getFlowController().getFlowManager());
        final ParameterContext parameterContext = new StandardParameterContext(UUID.randomUUID().toString(), "param-context", referenceManager);
        parameterContext.setParameters(Collections.singleton(new Parameter(new ParameterDescriptor.Builder().name("test").build(), "unit")));

        getRootGroup().setParameterContext(parameterContext);

        final Map<String, String> properties = new HashMap<>();
        properties.put("bar", "${#{test}:toUpper()}");
        updateAttribute.setProperties(properties);

        triggerOnce(generate);
        triggerOnce(updateAttribute);

        final FlowFileQueue flowFileQueue = updatedAttributeConnection.getFlowFileQueue();
        final FlowFileRecord flowFileRecord = flowFileQueue.poll(Collections.emptySet());

        assertEquals("UNIT", flowFileRecord.getAttribute("bar"));
    }

    @Test
    public void testParametersWhereELSupportedByNotPresent() throws ExecutionException, InterruptedException {
        final ProcessorNode generate = createProcessorNode(GenerateProcessor.class);
        final ProcessorNode updateAttribute = createProcessorNode(UpdateAttributeWithEL.class);
        final ProcessorNode terminate = getTerminateProcessor();

        final Connection generatedFlowFileConnection = connect(generate, updateAttribute, REL_SUCCESS);
        final Connection updatedAttributeConnection = connect(updateAttribute, terminate, REL_SUCCESS);

        final ParameterReferenceManager referenceManager = new StandardParameterReferenceManager(getFlowController().getFlowManager());
        final ParameterContext parameterContext = new StandardParameterContext(UUID.randomUUID().toString(), "param-context", referenceManager);
        parameterContext.setParameters(Collections.singleton(new Parameter(new ParameterDescriptor.Builder().name("test").build(), "unit")));

        getRootGroup().setParameterContext(parameterContext);

        final Map<String, String> properties = new HashMap<>();
        properties.put("foo", "#{test}");
        properties.put("bar", "#{test}#{test}");
        properties.put("baz", "foo#{test}bar");
        updateAttribute.setProperties(properties);

        triggerOnce(generate);
        triggerOnce(updateAttribute);

        final FlowFileQueue flowFileQueue = updatedAttributeConnection.getFlowFileQueue();
        final FlowFileRecord flowFileRecord = flowFileQueue.poll(Collections.emptySet());

        assertEquals("unit", flowFileRecord.getAttribute("foo"));
        assertEquals("unitunit", flowFileRecord.getAttribute("bar"));
        assertEquals("foounitbar", flowFileRecord.getAttribute("baz"));
    }
}
